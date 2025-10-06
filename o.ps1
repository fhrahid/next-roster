<#
Organize flattened versioned files into a folder tree.

Input filename patterns (examples):
  src_app_api_auth_login_route_Version2.ts
  prisma_schema_Version3.prisma
  package_Version5.json
  README_Version2.md
  source_styles_globals_Version1.css
  src_app_admin_dashboard_page.tsx      (no version suffix => version 0)

Rules:
  - Split on underscores. Last segment = file base name (stem).
  - Leading segment 'src' or 'source' is removed from directory path.
  - A suffix "_VersionN" (before extension) is stripped; N used as version.
  - No suffix => version 0.
  - Highest version kept unless -KeepAllVersions (then additional versions named stem-vN.ext).
  - Default action is MOVE into a "Source" root folder.
  - Use -Copy to copy instead.
  - Use -DryRun to preview.
  - Use -Overwrite:$false to skip existing targets.

Examples:
  powershell -ExecutionPolicy Bypass -File .\organize-files.ps1 -DryRun
  powershell -ExecutionPolicy Bypass -File .\organize-files.ps1
  powershell -ExecutionPolicy Bypass -File .\organize-files.ps1 -Copy -KeepAllVersions
#>

[CmdletBinding()]
param(
  [string]$InputFolder = ".",
  [string]$Root = "Source",
  [switch]$Copy,
  [switch]$DryRun,
  [switch]$KeepAllVersions,
  [switch]$Overwrite = $true
)

Write-Host "== Organize Flattened Files ==" -ForegroundColor Cyan
Write-Host ("InputFolder : {0}" -f $InputFolder)
Write-Host ("Root        : {0}" -f $Root)
Write-Host ("Mode        : {0}" -f ($(if($Copy){'COPY'}else{'MOVE'})))
Write-Host ("DryRun      : {0}" -f $DryRun.IsPresent)
Write-Host ("KeepAllVers : {0}" -f $KeepAllVersions.IsPresent)
Write-Host ("Overwrite   : {0}" -f $Overwrite.IsPresent)
Write-Host ""

if (!(Test-Path -LiteralPath $InputFolder)) {
  Write-Error "Input folder not found: $InputFolder"
  exit 1
}

$allFiles = Get-ChildItem -Path $InputFolder -File
if (-not $allFiles) {
  Write-Warning "No files found. Nothing to do."
  exit 0
}

# Pattern: <anything>_Version<number><ext>
$versionRegex = '^(?<base>.+?)_Version(?<ver>\d+)(?<ext>\.[^.]+)$'

$items = New-Object System.Collections.Generic.List[Object]

foreach ($f in $allFiles) {
  $originalName = $f.Name
  $ext  = [IO.Path]::GetExtension($originalName)
  $stem = if ($ext.Length -gt 0) { $originalName.Substring(0, $originalName.Length - $ext.Length) } else { $originalName }

  $version = 0
  $baseCore = $stem

  if ($originalName -match $versionRegex) {
    $baseCore = $matches['base']
    $version = [int]$matches['ver']
    $ext = $matches['ext']
  }

  $segments = $baseCore -split '_' | Where-Object { $_ -ne '' }

  $fileBaseName = ""
  $dirParts = @()

  switch ($segments.Count) {
    0 { $fileBaseName = $baseCore }
    1 { $fileBaseName = [string]$segments[0] }
    default {
      $fileBaseName = [string]$segments[-1]
      $dirParts = $segments[0..($segments.Count - 2)]
    }
  }

  # Normalize to strings to avoid char boxing issues
  $dirParts = $dirParts | ForEach-Object { $_.ToString() }

  # Drop leading src/source
  if ($dirParts.Count -gt 0) {
    $leading = ($dirParts[0].ToString()).ToLowerInvariant()
    if ($leading -in @('src','source')) {
      if ($dirParts.Count -gt 1) {
        $dirParts = $dirParts[1..($dirParts.Count - 1)]
      } else {
        $dirParts = @()
      }
    }
  }

  $relativeDir = ($dirParts -join [IO.Path]::DirectorySeparatorChar)
  $targetRoot  = Join-Path (Resolve-Path $InputFolder) $Root
  $targetDir   = if ([string]::IsNullOrWhiteSpace($relativeDir)) { $targetRoot } else { Join-Path $targetRoot $relativeDir }

  $finalFileName = "$fileBaseName$ext"
  $baseKey = Join-Path $targetDir $finalFileName

  $items.Add([PSCustomObject]@{
    Original  = $f
    Version   = $version
    BaseKey   = $baseKey
    TargetDir = $targetDir
    FileName  = $finalFileName
  })
}

if ($KeepAllVersions) {
  Write-Host "Keeping all versions (adding -vN)..." -ForegroundColor Yellow
  $allExpanded = New-Object System.Collections.Generic.List[Object]
  foreach ($grp in ($items | Group-Object BaseKey)) {
    if ($grp.Count -eq 1) {
      $allExpanded.Add($grp.Group[0])
      continue
    }
    foreach ($it in $grp.Group) {
      if ($it.Version -gt 0) {
        $ext = [IO.Path]::GetExtension($it.FileName)
        $stem = $it.FileName.Substring(0, $it.FileName.Length - $ext.Length)
        $it.FileName = "$stem-v$($it.Version)$ext"
      }
      $allExpanded.Add($it)
    }
  }
  $items = $allExpanded
} else {
  Write-Host "Selecting only highest version per file..." -ForegroundColor Yellow
  $items =
    $items |
    Group-Object BaseKey |
    ForEach-Object {
      $_.Group | Sort-Object Version -Descending | Select-Object -First 1
    }
}

Write-Host "`nPlan:"
$rootResolved = (Resolve-Path $InputFolder).Path
foreach ($it in $items | Sort-Object BaseKey) {
  $destPath = Join-Path $it.TargetDir $it.FileName
  $relative = $destPath -replace [Regex]::Escape($rootResolved), ''
  Write-Host ("  {0} (v{1}) -> {2}" -f $it.Original.Name, $it.Version, $relative.TrimStart('\'))
}
Write-Host ""

if ($DryRun) {
  Write-Host "DryRun: no changes performed." -ForegroundColor Cyan
  exit 0
}

foreach ($it in $items) {
  if (!(Test-Path -LiteralPath $it.TargetDir)) {
    New-Item -ItemType Directory -Path $it.TargetDir -Force | Out-Null
  }
  $destPath = Join-Path $it.TargetDir $it.FileName
  if ((Test-Path -LiteralPath $destPath) -and -not $Overwrite) {
    Write-Warning "Skipping (exists): $destPath"
    continue
  }
  if ($Copy) {
    Copy-Item -LiteralPath $it.Original.FullName -Destination $destPath -Force
    Write-Host ("Copied: {0} -> {1}" -f $it.Original.Name, $destPath)
  } else {
    Move-Item -LiteralPath $it.Original.FullName -Destination $destPath -Force
    Write-Host ("Moved : {0} -> {1}" -f $it.Original.Name, $destPath)
  }
}

Write-Host ""
Write-Host ("Done. Root created/updated at: {0}" -f (Join-Path (Resolve-Path $InputFolder) $Root)) -ForegroundColor Green
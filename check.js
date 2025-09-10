// https://www.aikido.dev/blog/npm-debug-and-chalk-packages-compromised
import * as fs from 'fs';

const packagesToCheck = [
  { name: 'backslash', version: '0.2.1' },
  { name: 'chalk-template', version: '1.1.1' },
  { name: 'supports-hyperlinks', version: '4.1.1' },
  { name: 'has-ansi', version: '6.0.1' },
  { name: 'simple-swizzle', version: '0.2.3' },
  { name: 'color-string', version: '2.1.1' },
  { name: 'error-ex', version: '1.3.3' },
  { name: 'color-name', version: '2.0.1' },
  { name: 'is-arrayish', version: '0.3.3' },
  { name: 'slice-ansi', version: '7.1.1' },
  { name: 'color-convert', version: '3.1.1' },
  { name: 'wrap-ansi', version: '9.0.1' },
  { name: 'ansi-regex', version: '6.2.1' },
  { name: 'supports-color', version: '10.2.1' },
  { name: 'strip-ansi', version: '7.1.1' },
  { name: 'chalk', version: '5.6.1' },
  { name: 'debug', version: '4.4.2' },
  { name: 'ansi-styles', version: '6.2.2' },
];

function loadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function checkInPackageLock(packageLock, name, version) {
  if (!packageLock || !packageLock.packages) {
    return false;
  }

  // Check in root packages object
  // Packages can be listed as "node_modules/package-name" or just "package-name"
  const possibleKeys = [
    `node_modules/${name}`,
    name,
    `packages/${name}`,
    `./node_modules/${name}`
  ];

  for (const key of possibleKeys) {
    if (packageLock.packages[key] && packageLock.packages[key].version === version) {
      return true;
    }
  }

  // Also check the legacy dependencies structure if it exists
  if (packageLock.dependencies) {
    return checkLegacyDependencies(packageLock.dependencies, name, version);
  }

  return false;
}

function checkLegacyDependencies(deps, name, version) {
  if (!deps) return false;

  // Direct check
  if (deps[name] && deps[name].version === version) {
    return true;
  }

  // Recursive check in nested dependencies
  for (const depName in deps) {
    if (deps[depName].dependencies) {
      if (checkLegacyDependencies(deps[depName].dependencies, name, version)) {
        return true;
      }
    }
  }

  return false;
}

const packageLockJson = loadJSON('./package-lock.json');
if (!packageLockJson) {
  console.error('Could not read package-lock.json in the current directory.');
  process.exit(1);
}

console.log('\n🔍 Checking package-lock.json for compromised package versions...\n');

let foundCount = 0;
packagesToCheck.forEach(({ name, version }) => {
  const found = checkInPackageLock(packageLockJson, name, version);

  console.log(`${name}@${version}`.padEnd(30) +
    (found ? '❌ FOUND - COMPROMISED' : '✅ not found')
  );

  if (found) {
    foundCount++;
  }
});

console.log(`\n📊 Summary: ${foundCount} compromised package(s) found in package-lock.json`);

if (foundCount > 0) {
  console.log('\n⚠️  WARNING: Compromised packages detected! Consider updating or removing these packages.');
  process.exit(1);
} else {
  console.log('\n✅ No compromised packages found in package-lock.json');
}

// folderTree.js
import fs from "fs";
import path from "path";

/**
 * @typedef {object} Options
 * @property {number} [maxDepth=3] - The maximum depth to traverse the directory tree. Defaults to 3.
 * @property {number} [maxFiles=5] - The maximum number of files to show per directory. Defaults to 5.
 * @property {string[]} [skipNestedIn=["node_modules"]] - Folder names whose contents should not be rendered.
 * @property {string} [startSubdir] - Optional nested folder name to start from.
 */

/**
 * Prints a tree representation of a directory, respecting specified depth and file limits.
 * Skips hidden files/folders and optionally skips rendering nested contents of certain directories.
 * @param {string} dirPath - The path to the directory to print.
 * @param {Options} [options={}] - Options for controlling the tree printing behavior.
 * @param {number} [depth=0] - The current recursion depth. Used internally for tree traversal.
 * @param {string} [prefix=""] - The indentation string for the current level. Used internally for formatting.
 * @returns {void}
 */
function printTree(dirPath, options = {}, depth = 0, prefix = "") {
	const {
		maxDepth = 3,
		maxFiles = 5,
		skipNestedIn = ["node_modules"],
	} = options;

	if (depth >= maxDepth) return;

	let entries = [];
	try {
		entries = fs.readdirSync(dirPath);
	} catch {
		return;
	}

	const files = [];
	const dirs = [];

	for (const entry of entries) {
		// 🚫 Skip hidden files/folders (starting with ".")
		if (entry.startsWith(".")) continue;

		const fullPath = path.join(dirPath, entry);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			dirs.push(entry);
		} else {
			files.push(entry);
		}
	}

	// Print directories first
	for (const dir of dirs) {
		console.log(`${prefix}📁 ${dir}`);

		// 🚫 Skip rendering nested contents if directory is in skip list
		if (skipNestedIn.includes(dir)) continue;

		printTree(path.join(dirPath, dir), options, depth + 1, prefix + "   ");
	}

	// Print files with limit
	const shownFiles = files.slice(0, maxFiles);
	for (const file of shownFiles) {
		console.log(`${prefix}📄 ${file}`);
	}
	if (files.length > maxFiles) {
		console.log(`${prefix}... (${files.length - maxFiles} more)`);
	}
}

// Usage example:
const targetDir = process.argv[2] || ".";
const options = {
	maxDepth: 3,
	maxFiles: 5,
	skipNestedIn: ["node_modules", "dist", "build"],
	startSubdir: process.argv[3], // optional second argument
};

// If startSubdir is provided, jump into it
const startPath = options.startSubdir
	? path.join(targetDir, options.startSubdir)
	: targetDir;

printTree(startPath, options);

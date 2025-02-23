import { execSync } from 'node:child_process'
import process from 'node:process'

const validLabels = [
	"bug",
	"chore",
	"docs",
	"enhancement",
	"pending",
	"pkg:core",
	"pkg:vue",
	"release"
]

const gitBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
const branchPattern = /^([a-z]+)\/([a-z0-9-]+)$/
const matchPattern = gitBranch.match(branchPattern)

if (!matchPattern) {
	console.error(`Invalid branch name ${gitBranch}`)
	console.error('Expected format: <type>/<feature-name>, e.g., bug/fix-login-issue')
	process.exit(1)
}

const [, branchType] = matchPattern
if (!validLabels.includes(branchType)) {
	console.error(`Invalid branch prefix: '${branchType}'`)
	console.error(`Must be one of: ${validLabels.join(", ")}`)
	process.exit(1)
}
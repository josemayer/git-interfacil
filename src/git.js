const execSync = require("child_process").execSync;
const formatStr =
  '{"id":"%h","author":"%an","message":"%s","createdAt":"%aI"},';

class Repository {
  update_repo_path(path) {
    this.path = path;
  }

  constructor(path) {
    this.update_repo_path(path);
  }

  get_repo_head() {
    return this.shell_exec("git rev-parse HEAD");
  }

  // TODO
  // - add branch field
  get_commit_info() {
    let commits = this.shell_exec(
      `git log --branches --format='format:${formatStr}'`,
    );
    // note that we must remove trailing comma before the closing bracket
    commits = "[" + commits.slice(0, -1) + "]";
    return JSON.parse(commits);
  }

  // receive array with file names
  add_files(files) {
    return this.shell_exec(`git add "${files.join(" ")}"`);
  }

  commit(message) {
    return this.shell_exec(`git commit -m "${message}"`);
  }

  commit_amend(message) {
    return this.shell_exec(`git commit --amend -m "${message}"`);
  }

  create_branch(branch) {
    return this.shell_exec(`git switch -c "${branch}"`);
  }

  switch_branch(branch) {
    return this.shell_exec(`git switch "${branch}"`);
  }

  push(remote, branch) {
    return this.shell_exec(`git push "${remote}" "${branch}"`);
  }

  shell_exec(command) {
    return execSync(command, {
      cwd: this.path,
      encoding: "utf8",
    });
  }
}

module.exports = {
  Repository,
};

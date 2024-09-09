const iconMap = {
  // Terminals
  "wezterm-gui": { icon: "ti-terminal-2" },
  alacritty: { icon: "ti-terminal-2" },
  windowsterminal: { icon: "ti-terminal-2" },

  // Editors
  code: { icon: "ti-brand-vscode" }, // VS Code
  devenv: { icon: "ti-brand-visual-studio" }, // Visual Studio

  // Communication
  "ms-teams": { icon: "ti-brand-teams" },
  olk: { icon: "ti-mail" }, // Outlook

  // VPN
  "azure vpn client": { icon: "ti-spy" }, // Azure VPN Client

  // Browsers
  zen: { icon: "ti-circle-letter-z" },
  msedge: { icon: "ti-brand-edge" },

  // Utils
  snippingtool: { icon: "ti-screenshot" },
  "control panel": { icon: "ti-settings" },
  explorer: { icon: "ti-folder" },
  photos: { icon: "ti-photo" },
  sound: { icon: "ti-headphones" },
  excel: { icon: "ti-file-spreadsheet" },
  onenote: { icon: "ti-note" },
  powerpnt: { icon: "ti-presentation" },
  winword: { icon: "ti-file-word" },
  mspaint: { icon: "ti-palette" },

  // Ignore
  msedgewebview2: { ignore: true },

  // Custom
  azuredatastudio: { icon: "ti-database" },
  storageexplorer: {icon: "ti-brand-azure"}
};

// Rewrite the workspaceIconMap to use only one icon
const workspaceIconMap = {
  "1": "ti-terminal-2",
  "2": "ti-brand-chrome",
  "3": "ti-briefcase-filled",
  "4": "ti-brand-github-copilot",
  "5": "ti-brand-whatsapp",
  "6": "ti-point",
  "7": "ti-point",
  "8": "ti-point",
  "9": "ti-headphones-filled",
  "0": "ti-gift-filled"
};

export const focusWorkspace = (event, context) => {
  const id = event.target.id;
  context.providers.glazewm.focusWorkspace(id);
};

const addProcessIconCallback = (mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const node = document.querySelector("#process-container");
      const iconNames = document.querySelectorAll("button.workspace");
      for (const iconName of iconNames) {
        const IconClasses = iconName.children[0].classList;
        const currentId = iconName.id;
        // Check if the icon is ti-point-filled or ti-point or ti-circle
        if (currentId in workspaceIconMap) {
          IconClasses.remove("ti-point-filled");
          IconClasses.remove("ti-point");
          IconClasses.remove("ti-circle");
          IconClasses.add(workspaceIconMap[currentId]);
        }
      }
      if (node) {
        const iconNodes = node.querySelectorAll(".ti");

        iconNodes.forEach((iconNode) => {
          const processName = iconNode.getAttribute("data-process-name");
          const title = iconNode.getAttribute("data-title");

          if (title.includes("youtube music")) {
            iconNode.classList.add("ti-brand-youtube-filled")
            return;
          }

          if (title.includes("league")) {
            iconNode.classList.add("ti-device-gamepad-2")
            return;
          }

          if (!processName && !title) return;
          const process = iconMap[processName] || iconMap[title];
          const unmapped = process == null;
          if (!unmapped && process.ignore) {
            iconNode.remove();
            return;
          }

          /** INFO: Edge case, all Windows apps has this process name,
           * to avoid some manual mapping, use title without brand */
          if (unmapped && processName == "applicationframehost") {
            iconNode.classList.add(`ti-${title}`);
          }

          iconNode.classList.add(
            unmapped ? `ti-brand-${processName}` : process.icon,
          );
        });
      }
    }
  }
};

const observer = new MutationObserver(addProcessIconCallback);
const config = { childList: true, subtree: false };
const parentNode = document.querySelector("#glazewm-workspaces");
if (parentNode) {
  observer.observe(parentNode, config);
} else {
  console.error("Parent node #glazewm-workspaces not found.");
}

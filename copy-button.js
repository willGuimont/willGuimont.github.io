document.addEventListener("DOMContentLoaded", function () {
    // Select all pre elements
    let blocks = document.querySelectorAll("pre");

    blocks.forEach((block) => {
        // Only process if it contains a code element and doesn't already have a copy button
        if (block.querySelector("code") && !block.parentElement.classList.contains("pre-container")) {
            if (navigator.clipboard) {
                // Container that holds the button and the code block
                let container = document.createElement("div");
                container.classList.add("pre-container");

                // Copy button
                let button = document.createElement("button");
                button.classList.add("copy-btn");
                button.setAttribute("aria-label", "Copy code");

                // Icon
                let icon = document.createElement("i");
                icon.classList.add("icon");
                button.appendChild(icon);

                // Wrap the block
                block.parentNode.insertBefore(container, block);
                container.appendChild(block);
                container.appendChild(button);

                button.addEventListener("click", async () => {
                    let code = block.querySelector("code");
                    let text = code.innerText;

                    try {
                        await navigator.clipboard.writeText(text);

                        // Visual feedback
                        button.classList.add("copied");

                        // Reset after delay
                        setTimeout(() => {
                            button.classList.remove("copied");
                        }, 2000);

                    } catch (err) {
                        console.error("Failed to copy:", err);
                    }
                });

                // Clear "copied" state on mouseleave
                container.addEventListener("mouseleave", () => {
                    button.classList.remove("copied");
                });
            }
        }
    });
});

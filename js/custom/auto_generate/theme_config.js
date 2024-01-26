document.subthemes_config = {
  "classic": {
    "enable": true,
    "extend_features": {
      "enable": true,
      "code_font": {
        "enable": true,
        "font_family": "Consolas, monospace"
      },
      "fixed_background": {
        "enable": false,
        "mask": {
          "enable": true,
          "list": [
            {
              "selector": "#web_bg",
              "style": "background-color: rgba(0, 0, 0, 0.3); margin: 0; padding: 0; border-radius: 1rem;"
            }
          ]
        }
      }
    }
  },
  "modern": {
    "enable": false
  },
  "none": {
    "enable": true,
    "extend_features": {
      "enable": true,
      "code_font": {
        "enable": true,
        "font_family": "'JetBrains Mono', Consolas, 'Courier New', Courier, monospace"
      },
      "fixed_background": {
        "enable": true,
        "mask": {
          "enable": true,
          "list": [
            {
              "selector": "#web_bg",
              "style": "background-color: rgba(0, 0, 0, 0.3); margin: 0; padding: 0; border-radius: 1rem;"
            },
            {
              "selector": "#board",
              "style": "background-color: rgba(0, 0, 0, 0);   margin: 0; padding: 0; border-radius: 1rem;"
            },
            {
              "selector": "#toc",
              "style": "background-color: rgba(0, 0, 0, 0.15);   margin: 0; padding: 0; border-radius: 1rem;"
            }
          ]
        }
      }
    }
  }
};
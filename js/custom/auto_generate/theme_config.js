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
        "enable": true,
        "mask": {
          "enable": true,
          "list": [
            {
              "selector": "#web_bg",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0.3); border-radius: 0rem;"
            }
          ]
        }
      }
    }
  },
  "modern": {
    "enable": true,
    "extend_features": {
      "code_font": {
        "enable": true,
        "font_family": "\"Jetbrains Mono\", Consolas, monospace",
        "font_weight": 600
      },
      "fixed_background": {
        "enable": true,
        "mask": {
          "enable": true,
          "list": [
            {
              "selector": "#web_bg",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0.3); border-radius: 0rem;"
            },
            {
              "selector": "#board",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0.15); border-radius: 1rem;"
            },
            {
              "selector": "#toc",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0.15); border-radius: 1rem;"
            }
          ]
        }
      }
    }
  },
  "none": {
    "enable": true,
    "extend_features": {
      "enable": false,
      "code_font": {
        "enable": false,
        "font_family": "SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace",
        "font_weight": 400
      },
      "fixed_background": {
        "enable": false,
        "mask": {
          "enable": true,
          "list": [
            {
              "selector": "#web_bg",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0.3);  border-radius: 1rem;"
            },
            {
              "selector": "#board",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0);    border-radius: 1rem;"
            },
            {
              "selector": "#toc",
              "enable": true,
              "style": "background-color: rgba(0, 0, 0, 0.15); border-radius: 1rem;"
            }
          ]
        }
      }
    }
  }
};
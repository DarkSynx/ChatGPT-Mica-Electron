module.exports = {
    initWebview: function (webviewName) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.on('ipcWebContentsAbonnement', (_, arg) => {
            console.log(`ipcWebContentsAbonnement: ${arg}`);
            ipcRenderer.send('ipcWebContentsAbonnement', [webviewName, arg]);
        });
    },
    connecttoaddrunnertext: function (prompt) {
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('ipcCentralMain', {
            "webview": "ChatGPT",
            "ipc": "ipcToWebViewChatGPT",
            "data": ["listaddrunnertext", prompt]
        });
    },
    sendPromptControle: function (prompt,de='') {
        console.log('sendPromptControle => ' + prompt);
        const {ipcRenderer} = require('electron');
        ipcRenderer.send('ipcCentralMain', {
            "webview": "ChatGPT",
            "ipc": "ipcToWebViewChatGPT",
            "data": ["promptcontrole", prompt, de]
        });
    },
    /**
     * Sends an ActionScript to the ChatGPT webview sandboxed environment through IPC.
     * @param {function} script - The ActionScript to be executed in the sandboxed environment.
     * @todo sendActionScript to the sandboxed environment.
     * @sandbox_property setTimeout, setInterval, clearTimeout, clearInterval, process, Buffer, setImmediate, clearImmediate, global, exports, module, require, __filename, __dirname, console( sealed && frozen: log, warn, error, info )
     */
    sendActionScript: function (script) {
        const {ipcRenderer} = require('electron');
        const serializedFunction = script.toString();
        ipcRenderer.send('ipcCentralMain', {
            "webview": "ChatGPT",
            "ipc": "ipcToWebViewChatGPT",
            "data": ["actionscript", JSON.stringify(serializedFunction)]
        });
        setTimeout(() => {
            ipcRenderer.send('disable-soft-navigation');
        }, 3000);
    }
};
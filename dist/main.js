"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web_1 = require("./application/web");
const logging_1 = require("./application/logging");
web_1.app.listen(3000, () => {
    logging_1.logger.info("Listening on port 3000");
});

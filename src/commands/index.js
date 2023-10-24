import PING_COMMAND from "./fun/ping.js";
import ANALYZE_COMMAND from "./food/analyze.js";
import LIST_COMMAND from "./food/list.js";

export function GetCommands(){
    return [
        PING_COMMAND, 
        ANALYZE_COMMAND,
        LIST_COMMAND
    ];
}

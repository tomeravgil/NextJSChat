interface chatData {
    email: string;
    message: string;
    time: number;
}

interface chatQuit {
    email: string;
    quit: boolean;
    time: number;
}

interface chatConfig {
    email: string;
    time: number;
}

export class ChatProtocol {
    private email: string;

    constructor(email:string){
        this.email = email;
    }

    /**
     * formats protocol message into JSON for database and ease of use with timestamp
     * @param message raw protocol message
     * @returns JSON String
     */
    process(args: string[]): (string | null) {
        if (args[0]==="chat"){
            const chatValues:  chatData = {
                email: this.email,
                message: args[2],
                time: Date.now()
            };
            return JSON.stringify(chatValues);
        }
        if (args[0] === "config"){
            this.email = args[1];
            const configValues: chatConfig = {
                email: this.email,
                time: Date.now()
            };
            return JSON.stringify(configValues);
        }
        if (args[0] === "quit"){
            const quitTime: chatQuit = {
                email: this.email,
                quit: true,
                time: Date.now()
            };
            return JSON.stringify(quitTime);
        }
        return null;        
    }

}









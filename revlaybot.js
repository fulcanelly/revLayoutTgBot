
process.env.NTBA_FIX_319 = 1 // убирает замечание при запуске бота
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, {polling: true});

const eng = '`qwertyuiop[]asdfghjkl;\'zxcvbnm,.'
const rus = 'ёйцукенгшщзхъфывапролджэячсмитьбю'

const layoutTable = { eng, rus }

function consistChar(text, char)
{
    return text
        .split('')
        .indexOf(char)
        >= 0
}

let evaluate = (text) => {
    text = text.toLowerCase()

    let rcount = 0,
        ecount = 0,
        ncount = 0

    text
        .split('')
        .map( elm => { 
            if(consistChar(eng, elm))
                ecount++
            else if(consistChar(rus, elm))
                rcount++
            else
                ncount++
        })
    return  { rus: rcount, eng: ecount }
}

class Layouts
{
    autoTr(text)
    {
        // name -> opposite
        let layoutNamesTable = {
            rus : "eng",
            eng : "rus",
        }

        let targetName = layoutNamesTable[this.layout[0]]

        this.reverseLayout(
            null,
            layoutTable[targetName],
            layoutTable[this.layout[0]]
        )

        this.outcomeLayput = targetName

        return this
    }

    guessCurrentLayout(text)
    {
        text = text || this.text
        let maxLayout = { count:null, layout:null }

        let points = evaluate(text)

        Object.entries(points)
            .reduce((behind, now) => {
                maxLayout = behind[1] > now[1] ? behind : now
                return now
            })
        
        this.layout = maxLayout
        return this
    }

    reverseLayout(text, targetLayout, currentLayout)
    {
        text = text || this.text

        this.outcomeString = new String

        for(let char of text)
        {
            let index = currentLayout
                .split('')
                .indexOf(char)
            
            if(index >= 0)
                this.outcomeString += targetLayout[index]
            else 
                this.outcomeString += char
        }
        return this
    }
    
    print()
    {
        console.log( this )
        return this
    }

    getstr()
    {
        return this.outcomeString
    }

    setText(text)
    {
        this.text = text
        return this
    }
}

let str = "kek"

new Layouts()
    .setText(str)
    .guessCurrentLayout()
    .autoTr()

///
TelegramBot.prototype.reply = (message) => {

}
 
let tr = true 

let greetingMessage = (message) => {

    
}
bot.onText(/\/help/, console.log)
bot.onText(/\/start/, console.log)

bot.on('message', (message) => {
    if(message.text && tr)
    {
        let translated = new Layouts()
            .setText(message.text)
            .guessCurrentLayout()
            .autoTr()
            .getstr()

        bot.sendMessage(
            message.chat.id, 
            translated
        )

        console.log(typeof(message))
        message.reply("")
        //bot.prototype.reply 
        message.text
        message.from.id
    }

})



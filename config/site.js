const { hostname } = window.location

let domain = './assets'

if (/github.io/.test(hostname)) domain = 'https://z2586300277.github.io/assets'

// else if ([/localhost/, /127.0.0.1/, /192.168/].some(r => r.test(hostname))) domain = 'https://z2586300277.github.io/assets'

const HTML_link = document.createElement('link')

HTML_link.rel = 'stylesheet'

HTML_link.href = domain + '/three-cesium-examples.css'

document.head.appendChild(HTML_link)

const HTML_script = document.createElement('script')

HTML_script.type = 'module'

HTML_script.src = domain + '/three-cesium-examples.js'

document.body.appendChild(HTML_script)

/* 
🌹🍀🍎💰📱🌙🍁🍂🍃🌷💎🔪🔫🏀⚽⚡👄👍🔥😀😁😂😃😄😅😆😉😊😋
😎😍😘😗😙😚☺😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲
😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀👻👽👦👧👨👩
👴👵👶👱👮👲👳👷👸💂🎅👰👼💆💇🙍🙎🙅🙆💁🙋🙇🙌🙏👤👥🚶🏃
👯💃👫👬👭💏💑👪💪👈👉☝👆👇✌✋👌👍👎✊👊👋👏👐✍👣👀👂👃
👅👄💋👓👔👕👖👗👘👙👚👛👜👝🎒💼👞👟👠👡👢👑👒🎩🎓💄💅💍
🌂🙈🙉🙊🐵🐒🐶🐕🐩🐺🐱😺😸😹😻😼😽🙀😿😾🐈🐯🐅🐆🐴🐎🐮🐂
🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🐘🐭🐁🐀🐹🐰🐇🐻🐨🐼🐾🐔🐓🐣🐤🐥
🐦🐧🐸🐊🐢🐍🐲🐉🐳🐋🐬🐟🐠🐡🐙🐚🐌🐛🐜🐝🐞🦋💐🌸💮🌹🌺
🌻🌼🌷🌱🌲🌳🌴🌵🌾🌿🍀🍁🍂🍃🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙
🌚🌛🌜☀🌝🌞⭐🌟🌠☁⛅☔⚡❄🔥💧🌊💩🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑
🍒🍓🍅🍆🌽🍄🌰🍞🍖🍗🍔🍟🍕🍳🍲🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥
🍡🍦🍧🍨🍩🍪🎂🍰🍫🍬🍭🍮🍯🍼☕🍵🍶🍷🍸🍹🍺🍻🍴🎪🎭🎨🎰
🚣🛀🎫🏆⚽⚾🏀🏈🏉🎾🎱🎳⛳🎣🎽🎿🏂🏄🏇🏊🚴🚵🎯🎮🎲🎷🎸
🎺🎻🎬👾🌋🗻🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪⛲🌁
🌃🌆🌇🌉🌌🎠🎡🎢🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚏🚐🚑🚒
🚓🚔🚕🚖🚗🚘🚚🚛🚜🚲⛽🚨🚥🚦🚧⚓⛵🚤🚢✈💺🚁🚟🚠🚡🚀🎑🗿
🛂🛃🛄🛅💌💎🔪💈🚪🚽🚿🛁⌛⏳⌚⏰🎈🎉🎊🎎🎏🎐🎀🎁📯📻📱📲
☎📞📟📠🔋🔌💻💽💾💿📀🎥📺📷📹📼🔍🔎🔬🔭📡💡🔦🏮📔📕📖📗
📘📙📚📓📃📜📄📰📑🔖💰💴💵💶💷💸💳✉📧📨📩📤📥📦📫📪📬📭
📮✏✒📝📁📂📅📆📇📈📉📊📋📌📍📎📏📐✂🔒🔓🔏🔐🔑🔨🔫🔧🔩
🔗💉💊🚬🔮🚩🎌💦💨💣☠♠♥♦♣🀄🎴🔇🔈🔉🔊📢📣💤💢💬💭♨🌀
🔔🔕✡✝🔯📛🔰🔱⭕✅☑✔✖❌❎➕➖➗➰➿〽✳✴❇‼⁉❓❔❕❗©®™🎦🔅
🔆💯🔠🔡🔢🔣🔤🅰🆎🅱🆑🆒🆓ℹ🆔Ⓜ🆕🆖🅾🆗🅿🆘🆙🆚🈁🈂🈷
🈶🈯🉐🈹🈚🈲🉑🈸🈴🈳㊗㊙🈺🈵▪▫◻◼◽◾⬛⬜🔶🔷🔸🔹🔺🔻💠
🔲🔳⚪⚫🔴🔵♈♉♊♋♌♍♎♏♐♑♒♓⛎💘❤💓💔💕💖💗💙💚💛💜💝
💞💟❣🌿🚧💒☎📟💽⬆↗➡↘⬇↙⬅↖↕↔↩↪⤴⤵🔃🔄🔙🔚🔛🔜🔝🔀
🔁🔂▶⏩◀⏪🔼⏫🔽⏬📱📶📳📴♻🏧🚮🚰♿🚹🚺🚻🚼🚾⚠🚸⛔🚫🚳
*/

const Discord = require('discord.js');	
	const eco = require("discord-economy");
	const { SubtractFromBalance } = require('discord-economy');
	const talked = new Set();
	const low = require("lowdb");
	const FileSync = require("lowdb/adapters/FileSync");
	const adapter = new FileSync("./database.json");
	const db = low(adapter);
	db.defaults({
	blacklist: []
	}).write();
	
	const client = new Discord.Client();
	
	
	const settings = {
	prefix: 'g!',
	}
	
	client.on('message', async message => {
	
	var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
	
	var args = message.content.split(' ').slice(1);
	
	if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
	
	if (command === 'banque') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var user = message.mentions.users.first()
	if(user){
	var output = await eco.FetchBalance(user.id)
	if(user.id === "574039998379065348"){
	var pp = new Discord.MessageEmbed()
	.setTitle("**Voici la banque de : **" + user.username)
	.setDescription("**:yen: **" + output.balance)
	.addField(`${user.username}`, " **Est un membre du conseil.** :key:")
	.setThumbnail(user.avatarURL)
	.setColor("RED")
	message.channel.send(pp)
	}
	else if(output.balance < 1000){
	var xd = new Discord.MessageEmbed()
	.setTitle("**Voici la banque de : **" + user.username)
	.setDescription("**:yen: **" + output.balance)
	.addField(`${user.username}`, " **Est un animal domestique.** :dog:")
	.setThumbnail(user.avatarURL)
	.setColor("YELLOW")
	message.channel.send(xd)
	}
	else if(output.balance >= 1000){
	var xd2 = new Discord.MessageEmbed()
	.setTitle("**Voici la banque de : **" + user.username)
	.setDescription("**:yen: **" + output.balance)
	.addField(`${user.username}`, " **Est un élève normal.** :man_student:")
	.setThumbnail(user.avatarURL)
	.setColor("BLUE")
	message.channel.send(xd2)
	
	}
	}
	else if(!user){
	var output = await eco.FetchBalance(message.author.id)
	if(message.author.id === "574039998379065348"){
	var pp2 = new Discord.MessageEmbed()
	.setTitle("**Voici la banque de : **" + message.author.username)
	.setDescription("**:yen: **" + output.balance)
	.addField(`${message.author.username}`, " **Est un membre du conseil.** :key:")
	.setThumbnail(message.author.avatarURL)
	.setColor("RED")
	message.channel.send(pp2)
	}
	else if(output.balance < 1000){
	var xd3 = new Discord.MessageEmbed()
	.setTitle("**Voici la banque de : **" + message.author.username)
	.setDescription("**:yen: **" + output.balance)
	.addField(`${message.author.username}`, " **Est un animal domestique.** :dog:")
	.setThumbnail(message.author.avatarURL)
	.setColor("YELLOW")
	message.channel.send(xd3)
	}
	else if(output.balance >= 1000){
	var xd4 = new Discord.MessageEmbed()
	.setTitle("**Voici la banque de : **" + message.author.username)
	.setDescription("**:yen: **" + output.balance)
	.addField(`${message.author.username}`, " **Est un élève normal.** :man_student:")
	.setThumbnail(message.author.avatarURL)
	.setColor("BLUE")
	message.channel.send(xd4)
	
	}
	}
	
	}
	
	if (command === 'daily') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var output = await eco.Daily(message.author.id)
	
	
	if (output.updated) {
	
	var profile = await eco.AddToBalance(message.author.id, 500)
	message.channel.send(`:money_with_wings: **Le conseil des élèves vous donne chaque jour une récompense pour vous aider à rester un élève normal. De rien!**`);
	
	} else {
	message.channel.send(`:no_entry_sign: **T'as cru tu pouvais nous berner comme ça? Ré-essaye dans ${output.timetowait}**`)
	}
	
	}
	
	
	if (command === 'add') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	message.delete()
	if(!message.author.id === "574039998379065348") return;
	var user = message.mentions.users.first()
	var amount = args[1]
	var add = await eco.AddToBalance(user.id, amount)
	}
	if (command === 'sub') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	message.delete()
	if(!message.author.id === "574039998379065348") return;
	var user = message.mentions.users.first()
	var amount = args[1]
	var sub = await eco.SubtractFromBalance(user.id, amount)
	}
	if (command === 'flip') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var flip = args[0]
	var amount = args[1]
	
	if (!flip || !['tails', 'heads'].includes(flip)) return message.channel.send(':no_entry_sign: **Essaye de spécifier si tu veux pile ou face. (tails ou heads)**')
	if (!amount) return message.channel.send(':no_entry_sign: **Essaye de spécifier le nombre de jetons que tu veux parier. Chaque jeton représente 1 Yen.**')
	
	var output = await eco.FetchBalance(message.author.id)
	if (output.balance < amount) return message.reply(":no_entry_sign: **Dommage! Tu n'as pas assez de jetons!**")
	
	var gamble = await eco.Coinflip(message.author.id, flip, amount).catch(console.error)
	message.channel.send(":coin: **C'est parti!**")
	if(gamble.output === "lost"){
	message.channel.send(`**Tu as perdu! Voici ton nouveau montant d'argent: ${gamble.newbalance} Yen**`)
	}
	else if(gamble.output === "won"){
	message.channel.send(`**Tu as gagné! Voici ton nouveau montant d'argent: ${gamble.newbalance} Yen**`)
	}
	if(gamble.newbalance == 0){
	message.channel.send(":thinking: **Tiens tiens. Tu n'as plus d'argent? Tu peux toujours demander un peu de jetons au conseil des élèves mais fait bien attention! Tu pourrais t'endetter beaucoup plus que tu ne le penses.**")
	}
	}
	
	if (command == 'delete') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	message.delete()
	var user = message.mentions.users.first()
	
	if(!message.author.id === "574039998379065348") return;
	
	var output = await eco.Delete(user.id)
	talked.delete(user.id);
	}
	
	if (command === 'spin') {
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var amount = args[0]
	
	if (!amount) return message.channel.send(':no_entry_sign: **Essaye de spécifier le nombre de jetons que tu veux parier. Chaque jeton représente 1 Yen.**')
	
	var output = await eco.FetchBalance(message.author.id)
	if (output.balance < amount) return message.channel.send(":no_entry_sign: **Dommage! Tu n'as pas assez de jetons!**")
	
	var gamble = await eco.Slots(message.author.id, amount, {
	width: 3,
	height: 1
	}).catch(console.error)
	message.channel.send(gamble.grid)
	if(gamble.output === "lost"){
	message.channel.send(`**Tu as perdu! Voici ton nouveau montant d'argent: ${gamble.newbalance} Yen**`)
	}
	else if(gamble.output === "won"){
	message.channel.send(`**Tu as gagné! Voici ton nouveau montant d'argent: ${gamble.newbalance} Yen**`)
	}
	if(gamble.newbalance == 0){
	message.channel.send(":thinking: **Tiens tiens. Tu n'as plus d'argent? Tu peux toujours demander un peu de jetons au conseil des élèves mais fait bien attention! Tu pourrais t'endetter beaucoup plus que tu ne le penses.**")
	}
	
	}
	if(command === "lot"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var gamble = await eco.Work(message.author.id, {
	failurerate: 99,
	money: 100000
	})
	var price = 100;
	if(gamble.balance < price){
	return message.channel.send(":no_entry_sign: **Dommage! Tu n'as pas assez d'argent pour jouer.**")
	}
	else{
	var subtract = await eco.SubtractFromBalance(message.author.id, 100)
	if (gamble.earned == 0){
	message.channel.send(":money_with_wings: **Dommage mais tu n'as pas gagné!**")
	}
	else if(!gamble.earned == 0){
	var adddd = await eco.AddToBalance(message.author.id, price)
	message.channel.send(`:moneybag: **Je dirais, impréssionnant. Tu as gagné 100000 de Yen à la lotterie. Bravo!**`)
	}
	if(subtract.newbalance == 0){
	message.channel.send(":thinking: **Tiens tiens. Tu n'as plus d'argent? Tu peux toujours demander un peu de jetons au conseil des élèves mais fait bien attention! Tu pourrais t'endetter beaucoup plus que tu ne le penses.**")
	}
	}
	}
	if(command === "set"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	message.delete()
	if (!message.guild.me.hasPermission(`ADMINISTRATION`)) return;
	var user = message.mentions.users.first()
	var amount = args[1]
	var set = await eco.SetBalance(user.id, amount)
	}
	if(command === "ping"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var t = new Discord.MessageEmbed()
	.setTitle(" 🏓 **Pong!**")
	.setColor("AQUA")
	.setDescription(`Votre ping est de ${message.createdTimestamp - message.createdTimestamp}ms! Le ping du bot est de ${Math.round(client.ws.ping)}ms!`)
	.setThumbnail(message.author.avatarURL)
	message.channel.send(t);
	}
	if(command === "help"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	const prefix = "g!";
	var ty = new Discord.MessageEmbed()
	.setColor("GOLD")
	.setTitle("📖 **Menu Help**")
	.setDescription("*Ici, vous trouverez une liste des commandes*")
	.addField(`**${prefix} banque**`, " - *Vous montre votre banque ou la banque de quelqu'un d'autre.*")
	.addField(`**${prefix} lot**`," - *Achète un billet de lotterie pour 100 Yen. 1 chance sur 100 de gagner.*")
	.addField(`**${prefix} spin**`, " - *Lance une machine à sous.*")
	.addField(`**${prefix} flip**`, " - *Lance une pièce de pile ou face.*")
	.addField(`**${prefix} daily**`, " - *Vous permet d'obtenir 500 Yen gratuit chaque jour.*")
	.addField(`**${prefix} guess**`, " - *Jeu dans lequel vous devez choisir un nombre entre 1 et 500. Coûte 100 Yens pour jouer.*")
	.addField(`**${prefix} boutique**`, " - *Vous montre la boutique d'objets.*")
	.addField(`**${prefix} pay**`, " - *Donne de l'argent de votre poche à un utilisateur.*")
	.addField(`**${prefix} ping**`," - *Vous donne le ping du bot et votre ping.*")
	.addField(`**${prefix} work**`, " - *Vous permet de travailler pour de l'argent chaque 5 minutes.*")
	.setTimestamp()
	.setThumbnail("https://static.wikia.nocookie.net/kakegurui/images/7/78/HyakkaoAcademy.jpg/revision/latest?cb=20190809132405")
	message.channel.send(ty);
	}
	if(command === "guess"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var num = args[0];
	var number = Math.floor(Math.random() * 500)
	var amount = 100;
	var output = await eco.FetchBalance(message.author.id)
	if(isNaN(num)) return message.channel.send(":no_entry_sign: **Veuillez entrer un nombre!**")
	if(num > 500) return message.channel.send(":no_entry_sign: **Veuillez entrer un nombre entre 1 et 500!**")
	if(num < 1) return message.channel.send(":no_entry_sign: **Veuillez entrer un nombre entre 1 et 500!**")
	if (output.balance < amount) return message.channel.send(":no_entry_sign: **Dommage! Tu n'as pas assez de jetons!**")
	if(!num) return message.channel.send(":no_entry_sign: **Veuillez entrer un nombre entre 1 et 500!**")
	else if(num){
	if(num != number){
	var h = await eco.SubtractFromBalance(message.author.id, 100)
	message.channel.send(`:money_with_wings: **Dommage mais tu n'as pas gagné! Le nombre était ${number}**`)
	}
	else if(num == number){
	var j = await eco.AddToBalance(message.author.id, 500000)
	message.channel.send(":moneybag: **Bravo! Je m'attendais franchement à te voir perdre.**")
	}
	if(h.newbalance == 0){
	message.channel.send(":thinking: **Tiens tiens. Tu n'as plus d'argent? Tu peux toujours demander un peu de jetons au conseil des élèves mais fait bien attention! Tu pourrais t'endetter beaucoup plus que tu ne le penses.**")
	}
	}
	}
	if(command === "boutique"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var g = new Discord.MessageEmbed()
	.setTitle(":moneybag: **Boutique**")
	.setDescription("*Bienvenue à la boutique. Ici, tu peux dépenser tes yens. (Utilise la commande g!buy [numéro de l'item] pour acheter)*")
	.addField("1- **Beignet** - ", "*10 Yens.*")
	.addField("2- **Eau** - ", "*5 Yens*")
	.addField("3- **Repas** - ", "*50 Yens*")
	.addField("4- **Rôle Personalisé** - ", "*100000 Yens*")
	.addField("5- **Permissions Vocal** - ", "*500000 Yens*")
	.setColor("GREEN")
	.setTimestamp()
	message.channel.send(g)
	}
	if(command === "buy"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	item = args[0]
	var output = await eco.FetchBalance(message.author.id)
	if(!item) return message.channel.send(":no_entry_sign: **Veuillez préciser un item que vous souhaitez acheter.")
	if(item == "1"){
	if(output.balance < 10) return message.channel.send(":no_entry_sign: **Vous n'avez pas assez d'argent pour acheter cet objet!**")
	else if(output.balance >= 10){
	var lol = await eco.SubtractFromBalance(message.author.id, 10)
	message.channel.send(":white_check_mark: **Vous avez bel et bien acheté un beignet!**")
	}
	}
	else if(item == "2"){
	if(output.balance < 5) return message.channel.send(":no_entry_sign: **Vous n'avez pas assez d'argent pour acheter cet objet!**")
	else if(output.balance >= 5){
	var lol = await eco.SubtractFromBalance(message.author.id, 5)
	message.channel.send(":white_check_mark: **Vous avez bel et bien acheté une bouteille d'eau!**")
	}
	}
	else if(item == "3"){
	if(output.balance < 50) return message.channel.send(":no_entry_sign: **Vous n'avez pas assez d'argent pour acheter cet objet!**")
	else if(output.balance >= 50){
	var lol = await eco.SubtractFromBalance(message.author.id, 50)
	message.channel.send(":white_check_mark: **Vous avez bel et bien acheté un repas!**")
	}
	}
	else if(item == "4"){
	if(output.balance < 100000) return message.channel.send(":no_entry_sign: **Vous n'avez pas assez d'argent pour acheter cet objet!**")
	else if(output.balance >= 100000){
	var lol = await eco.SubtractFromBalance(message.author.id, 100000)
	message.channel.send(":white_check_mark: **Vous avez bel et bien acheté un rôle personnalisé!**")
	let code = '';
	let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for(var i = 0; i < 16; i++){
	code = code + dict.charAt(Math.floor(Math.random() * dict.length));
	}
	client.users.cache.get(message.author.id).send("**Ceci est un message prouvant que vous avez acheté l'item suivant:** *Rôle Personnalisé.* **Sous l'ID suivant: **" + message.author.id + "**Pour en bénificier, veuillez envoyer une photo de ce message à un administrateur. Voici votre code de confirmation: **" + code)
	}
	}
	else if(item == "5"){
	if(output.balance < 500000) return message.channel.send(":no_entry_sign: **Vous n'avez pas assez d'argent pour acheter cet objet!**")
	else if(output.balance >= 500000){
	var lol = await eco.SubtractFromBalance(message.author.id, 500000)
	message.channel.send(":white_check_mark: **Vous avez bel et bien acheté des permissions vocal!**")
	let code = '';
	let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	for(var i = 0; i < 16; i++){
	code = code + dict.charAt(Math.floor(Math.random() * dict.length));
	}
	client.users.cache.get(message.author.id).send("**Ceci est un message prouvant que vous avez acheté l'item suivant:** *Permissions Vocal.* **Sous l'ID suivant: **" + message.author.id + "**Pour en bénificier, veuillez envoyer une photo de ce message à un administrateur. Voici votre code de confirmation: **" + code)
	}
	}
	}
	if(command === "pay"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	var user = message.mentions.users.first()
	var amount = args[1]
	var output = await eco.FetchBalance(message.author.id)
	if(output.balance < amount) return message.channel.send(":no_entry_sign: **Vous n'avez pas assez d'argent pour donner ce montant!**")
	if(!user) return message.channel.send(":no_entry_sign: **Vous devez ping un utilisateur!**")
	if(!amount) return message.channel.send(":no_entry_sign: **Vous devez préciser un montant d'argent à donner!**")
	else if(user){
	if(amount){
	var sub = await eco.Transfer(message.author.id, user.id, amount)
	message.channel.send(`:white_check_mark: **${amount} Yens ont été envoyé à ${user.username}, de la part de ${message.author.username}!**`)
	}
	}
	}
	if(command === "work"){
	if (db.get("blacklist").find({
	id: message.author.id
	}).value()) return message.channel.send("Tu es blacklist du bot ! :no_entry_sign:");
	if (message.channel.type === "dm") {
	return;
	}
	if(talked.has(message.author.id)){
	message.channel.send(":no_entry_sign: **Attend 5 minutes avant de travailler encore.**")
	}
	else {
	var output = await eco.Work(message.author.id, {
	failurerate: 10,
	money: Math.floor(Math.random() * 1000),
	jobs: ['Assistant', 'Nettoyeur', 'Cantine', 'Arbitre de jeu', 'Gardien', 'Chien de la présidente', 'Balayeur', 'Coach sportif', 'Banquier']
	})
	if (output.earned == 0) return message.reply(':no_entry_sign: **Même au travail tu es un perdant. Ré-essaye dans 5 minutes.')
	
	message.channel.send(`:white_check_mark: **Merci beaucoup, ${message.author.username} d'avoir travaillé en tant que** *${output.job}.* **Voilà ${output.earned} Yens pour toi.**`)
	}
	talked.add(message.author.id);
	setTimeout(() => {
	talked.delete(message.author.id);
	}, 300000);
	}
	if (command === "blacklist") {
	if (!(message.author.id === "574039998379065348")) return message.channel.send(":no_entry_sign: Vous n'êtes pas un propriétaire du bot pour utiliser cette commande!")
	let args = message.content.split(" ").slice(1)
	args[0] = message.mentions.members.first()
	var u = args[0]
	if (!u) return message.channel.send("Veuillez mentionner un utilisateur ! :no_entry_sign:")
	else {
	db.get("blacklist").push({
	id: u.id
	}).write()
	message.channel.send(`<@${u.id}> a bien été blacklist du bot ! :white_check_mark:`)
	}
	}
	if (command === "pardon") {
	if (!(message.author.id === "574039998379065348")) return message.channel.send(":no_entry_sign: Vous n'êtes pas un propriétaire du bot pour utiliser cette commande!")
	let args = message.content.split(" ").slice(1)
	args[0] = message.mentions.members.first()
	var u = args[0]
	
	if (!u) return message.channel.send("Veuillez mentionner un utilisateur ! :no_entry_sign:")
	else {
	db.get("blacklist").pop({
	id: u.id
	}).write()
	message.channel.send(`<@${u.id}> a bien été retiré de la blacklist du bot ! :white_check_mark:`)
	}
	}
	});
	
	client.login("You thought?")

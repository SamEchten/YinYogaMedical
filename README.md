# Het Eigen Wijze Lichaam
Project kennismanagement voor Het Eigen Wijze Lichaam

#### Toegang tot website

De werkende code is te vinden op de website: https://het-eigen-wijze-lichaam.nl
Op deze website runt de branch stable, hierop staat de stabiele code, op de main branch wordt door het team gewerkt.

Om dit project lokaal te kunnen runnen kunt u het project downloaden.
Van belang is dat u NPM heeft geinstalleerd op uw computer.

#### Project installeren en starten

Om het project te runnen doet u het volgende:

In de directory van het project voert u de volgende commando's uit:

```
npm i	#installeerd alle dependencies voor het project
npm start #start de applicatie
```

#### Betalingen

Om betalingen te kunnen uitvoeren in het van belang dan de Mollie Api toegang heeft van u project, dit kan doormiddel van Ngrok.
Zie https://ngrok.com/ voor meer informatie.

Veranderd vervolgens in het config bestand de webhookUrl naar uw ngrok url.
Doe dit zelfde voor de baseUrl in ApiCaller.js

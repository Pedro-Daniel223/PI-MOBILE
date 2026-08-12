
==========================================================
COMANDOS EXPO - DESENVOLVIMENTO MOBILE
==========================================================

1) npm start -c

Inicia o Expo/Metro e limpa o cache antes de iniciar.

Use quando:
- alterações não aparecem no app;
- Metro está usando código antigo;
- existem erros estranhos de cache;
- após mudanças importantes no frontend.

Equivalente a:
npx expo start -c


----------------------------------------------------------

2) npm run start:tunnel

Inicia o Expo usando TUNNEL.

Use quando:
- celulares estão em redes Wi-Fi diferentes;
- celular está usando 4G/5G;
- apresentação do projeto;
- celular não consegue acessar o IP local do computador.

O tunnel cria um endereço público temporário para o Metro.

Arquitetura:

Celular
   ↓ 
Internet
Expo Tunnel
   ↓
Metro no computador

A API continua independente:

Celular
   ↓
https://projeto-futebol.onrender.com
   ↓
Django / Render
   ↓
MySQL / Aiven



<!-- √ The package @expo/ngrok@^4.1.0 is required to use tunnels, would you like to install it globally? ... yes
Installing @expo/ngrok@^4.1.0... -->
<!-- fica atento a isso, pode gerar problemas futuros -->

----------------------------------------------------------

3) npx expo start -c

Forma direta de iniciar o Expo limpando o cache.

É praticamente o equivalente a:

npm start -- -c

ou ao `npm start -c` usado no projeto, dependendo de como o
script "start" está definido no package.json.


----------------------------------------------------------

ATENÇÃO:

"expo npm start -c" NÃO é um comando válido.

Use:

npm start -c

ou:

npx expo start -c


----------------------------------------------------------

PARA APRESENTAÇÃO:

npm run start:tunnel

PARA DESENVOLVIMENTO NORMAL:

npm start

SE HOUVER PROBLEMA DE CACHE:

npm start -c
==========================================================
*/
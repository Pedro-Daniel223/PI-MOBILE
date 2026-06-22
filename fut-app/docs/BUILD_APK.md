# Gerando o APK — fut-app (Drakos-app)

> Passo a passo oficial para gerar o APK do app usando **EAS Build** (Expo Application Services).

---

## Pré-requisitos

- Node.js instalado
- Conta Expo (gratuita)
- CLI do Expo e EAS instalados:
  ```sh
  npm install -g expo-cli eas-cli
  ```

---

## 1. Faça login no Expo

```sh
eas login
```

Insira suas credenciais da conta Expo. Sem login não é possível fazer upload do build.

---

## 2. Vá até a pasta do projeto

```sh
cd fut-app
```

---

## 3. Configure o EAS Build

```sh
eas build:configure
```

Esse comando cria o arquivo `eas.json` na raiz do projeto.

Se quiser definir manualmente, use:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

O perfil **preview** é o que gera APK.  
Se quiser um release otimizado para publicação na Play Store, use `buildType: "app-bundle"`.

---

## 4. Gere o APK para Android

```sh
eas build --platform android --profile preview
```

O que acontece:
- Compacta o projeto (cerca de 27 MB)
- Faz upload para os servidores da Expo
- Gera a Keystore na nuvem (se for a primeira vez)
- Inicia o build remoto

Tempo estimado: **5 a 15 minutos**.

---

## 5. Acompanhe e baixe o APK

Quando o build terminar, o terminal exibirá um link como:

```
https://expo.dev/accounts/SEU_USUARIO/projects/Drakos-app/builds/XXXXXXX
```

Abra esse link no navegador e clique em **Download** para salvar o `.apk`.

Você também pode acompanhar pelo comando:

```sh
eas build:view
```

---

## 6. (Opcional) Gere para iOS

```sh
eas build --platform ios --profile preview
```

> Para iOS é necessário ter uma conta **Apple Developer** cadastrada e ativa.  
> O resultado é um arquivo `.ipa`, não um `.apk`.

---

## Problemas comuns

| Erro | Causa | Solução |
|---|---|---|
| `Not logged in` | Falta de login no Expo | Execute `eas login` |
| Build falha por dependência | Versões incompatíveis | Rode `npm install` antes do build |
| `keytool not found` | Java não instalado | Instale o JDK |
| iOS pede credenciais Apple | Conta Developer faltando | Cadastre em developer.apple.com |

---

## Referências

- [EAS Build — Documentação oficial](https://docs.expo.dev/eas/build/)
- [Perfis de build](https://docs.expo.dev/eas/build-reference/preview-builds/)
- [Distribuição Android](https://docs.expo.dev/distribution/app-stores/)

## 🌡️ Monitor de Temperatura e Umidade

O monitor de temperatura e umidade deste projeto utiliza o protocolo MQTT para coletar, transmitir e exibir dados ambientais em tempo real.

### 🛠️ Funcionalidades

- **Leitura de sensores**: Captura valores de temperatura e umidade de sensores conectados.
- **Envio via MQTT**: Publica as leituras em tópicos MQTT configuráveis, permitindo integração com outros sistemas IoT.
- **Recepção em tempo real**: Recebe dados publicados e exibe as informações de forma dinâmica na interface web.
- **Visualização Web**: Interface simples em HTML/CSS/JavaScript para monitoramento dos dados recebidos.

### 🚀 Como utilizar

1. **Configuração do broker MQTT**
   - Abra o arquivo JavaScript responsável pela conexão MQTT (por exemplo, `main.js` ou equivalente).
   - Localize a linha onde o endereço do broker está definido (exemplo: `const broker = 'wss://test.mosquitto.org:8081'`).
   - Altere para o broker desejado, se necessário.

2. **Configuração dos tópicos**
   - No mesmo arquivo JavaScript, procure pelas variáveis que representam os tópicos MQTT (exemplo: `const topic = 'iot/monitor'`).
   - Você pode modificar o nome do tópico conforme sua necessidade.

3. **Como rodar**
   - Certifique-se de ter um broker MQTT disponível (pode usar um público como o Mosquitto).
   - Abra o arquivo HTML principal (por exemplo, `index.html`) em seu navegador.
   - O monitor irá conectar ao broker MQTT e exibir os valores de temperatura e umidade recebidos.

4. **Personalização**
   - Para alterar intervalos de leitura ou a lógica de atualização, edite o código JavaScript do monitor.
   - Para modificar o layout ou cores da interface, edite os arquivos CSS.

### 📂 Onde alterar

- **Broker e tópico MQTT:**  
  Arquivo JavaScript principal (`main.js` ou similar), variáveis `broker`, `topic`.
- **Intervalo de atualização:**  
  Funções de temporização no JavaScript (exemplo: `setInterval`).
- **Layout e estilo:**  
  Arquivo CSS (exemplo: `style.css`).

### 💡 Exemplo de alteração de broker

```javascript
// Antes:
const broker = 'wss://test.mosquitto.org:8081';

// Depois (exemplo com outro broker):
const broker = 'wss://seubroker.com:port';
```

### 💡 Exemplo de alteração de tópico

```javascript
// Antes:
const topic = 'iot/monitor';

// Depois:
const topic = 'meuprojeto/temperatura';
```

---

> O monitor facilita o acompanhamento de ambientes, sendo útil para automação residencial, agricultura, laboratórios e aplicações industriais.

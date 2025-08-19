//Importar a classe "client" do pacote mqtt-paho
import { Client } from "paho-mqtt";

let client; // Variável global para armazenar a instância do cliente MQTT

export const connectMQTT = (onMessageReceived) => {
  // Usar wss na porta 8884

  client = new Client(
    "broker.hivemq.com",
    8884,
    "/mqtt",
    "reactClient" + Math.random()
  );
  client.onConnectionLost = (responseObject) => {
    console.log("Conexão perdida. ", responseObject);
  };

  client.onMessageArrived = (message) => {
    onMessageReceived(message.destinationName, message.payloadString);
  };

  client.connect({
    useSSL: true,
    onSuccess: () => {
      console.log("🟢 Conectado com sucesso ao broker MQTT!");
      // Aqui você pode inscrever-se em tópicos, se necessário

      client.subscribe("luizG/resp_enviada");
      client.subscribe("luizG/resultado");
      client.subscribe("luizG/statusAluno");
    },
    onFailure: (error) => console.error("Erro MQTT:  ", error)
  });
};

export const publishMessage = (topic, payload) => {
  if (!client) return;

  const message = new window.Paho.MQTT.Message(payload);
  message.destinationName = topic;
  client.send(message);
};






#include <WiFi.h>
#include <PubSubClient.h>
#include <LiquidCrystal_I2C.h>

// ---------- WiFi + MQTTT------------



const char* ssid = "Wokwi-GUEST";
const char* password = "";



const char* mqttServer = "broker.hivemq.com";
const int mqttPort = 8884;
const char* mqttTopicQuiz = "luizG/quiz";

 bool wasConnected = false; // Variável boleana para detectar se o ESP32 está conectado a internet ou não.

WiFiClient espClient;
PubSubClient client(espClient);

// --------- PIN Botões -------- //

#define BTN_TRUE 25
#define BTN_FALSE 26
#define LED_GREEN 32
#define LED_RED 33

// ---------------------------- LCD -------------------------

LiquidCrystal_I2C lcd(0x27, 16, 2);

// ------------------------ Estrutura de Perguntas ---------------------- //

struct Pergunta {
  const char* texto;
  bool resposta;
};

Pergunta perguntas[30]={
  {"IoT significa Internet of Things?", true},
  {"O ESP32 nao possui WiFi?", false},
  {"MQTT eh um protocolo de mensagens?", true},
  {"Sensores nao podem ser usados em IoT?", false},
  {"O broker MQTT gerencia mensagens?", true},
  {"IoT so funciona com cabo?", false},
  {"HiveMQ eh um broker MQTT?", true},
  {"O ESP32 tem Bluetooth?", true},
  {"TCP/IP nao eh usado no IoT?", false},
  {"IoT pode ser usado em casas inteligentes?", true},
  {"Dispositivos IoT podem ser controlados remotamente?", true},
  {"A sigla HTTP significa HyperText Transfer Protocol?", true},
  {"O protocolo CoAP nao eh usado em IoT?", false},
  {"IoT pode melhorar a agricultura?", true},
  {"O ESP32 nao possui GPIOs?", false},
  {"Sensores medem variaveis do ambiente?", true},
  {"IoT nao se conecta na internet?", false},
  {"O protocolo MQTT usa topicos?", true},
  {"IoT eh usado em smart cities?", true},
  {"ESP32 pode ser programado em C++?", true},
  {"IoT significa Internet of Trees?", false},
  {"WiFi eh usado em IoT?", true},
  {"MQTT usa o modelo publisher/subscriber?", true},
  {"Sensores IoT podem coletar temperatura?", true},
  {"IoT nao tem aplicacao em saude?", false},
  {"ESP32 eh um microcontrolador?", true},
  {"O protocolo LoRa pode ser usado em IoT?", true},
  {"IoT depende apenas de conexao 4G?", false},
  {"IoT pode ser aplicado em industria?", true},
  {"IoT eh inutil para automacao residencial?", false}
};

// ----------------------- Controle do Quiz ---------------------------- //
int perguntasSorteadas[5];
int perguntasRespondidas = 0;
int acertos = 0;
int erros = 0;
int indiceAtual = 0;
bool jogoAtivo = false;


void sorteiaPergunta() {
  for (int i = 0; i < 5; i++){
    int sorteada;
    bool repetida;
    do{sorteada = random(0, 30);
    repetida = false;
    for(int j = 0; j < i; j++){
      if(perguntasSorteadas[j] == sorteada){
        repetida = true;
        break;
      }

    }
    } while(repetida);
    perguntasSorteadas[i] = sorteada;
  }
}

void mostrarPergunta(){
  indiceAtual = perguntasSorteadas[perguntasRespondidas];
  String texto = String(perguntas[indiceAtual].texto);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pergunta ");
  lcd.print(perguntasRespondidas + 1);
  lcd.print(":");


  int len = texto.length();
  if (len <= 16) {
    lcd.setCursor(0,1);
    lcd.print(texto);
  } else {
    for (int pos = 0; pos <= len - 16; pos++) {
      lcd.setCursor(0, 1);
      lcd.print(texto.substring(pos, pos + 16));
      delay(400);
    }
  }
}

void verificarResposta(bool respostaUsuario) {
  bool correta = (respostaUsuario == perguntas[indiceAtual].resposta);
if(correta) {
  digitalWrite(LED_GREEN, HIGH);
  digitalWrite(LED_RED, LOW);
  acertos++;
  client.publish("luizG/resp_enviada", "Correta");
} else{
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_RED, HIGH);
  erros++;
  client.publish("luizG/resp_enviada", "Errada");
}
delay(1500);
digitalWrite(LED_RED, LOW);
digitalWrite(LED_GREEN, LOW);

perguntasRespondidas++;

if(perguntasRespondidas >= 5){
  float media = (acertos / 5) * 100;
  char resultado[80];
  sprintf(resultado, "Acertos:%d Erros:%d Media:%1.f%%", acertos, erros, media);
  client.publish("luizG/resultado", resultado);

  String status = (media >= 60) ? "Aprovado" : "Reprovado";


  // ----- MOSTRAR RESULTADOS NA TELA POR 5s ----- //

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Acertos: ");
  lcd.print(acertos);
  lcd.print("Erros: ");
  lcd.print(erros);

  lcd.setCursor(0, 1);
  lcd.print("Media: ");
  lcd.print(media,1);
  lcd.print("%");

  delay(5000);

  // Reiniciar o Game maroto
  jogoAtivo = false;
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Quiz IoT - v1.0");
  lcd.setCursor(0,1);
  lcd.print("Iniciar? ");
  return;

}

mostrarPergunta();
}


// --------- Setup ----------

// void setup() {
//   // put your setup code here, to run once:
//   Serial.begin(115200);
//   Serial.println("Hello, ESP32!");

//   pinMode(BTN_FALSE, INPUT_PULLUP);
//   pinMode(BTN_TRUE, INPUT_PULLUP);
//   pinMode(LED_GREEN, OUTPUT);
//   pinMode(LED_RED, OUTPUT);

//   lcd.init();
//   lcd.backlight();
//   lcd.setCursor(0,0);
//   lcd.print("Conectando...");


//   WiFi.begin(ssid, password);
//   while(WiFi.status() != WL_CONNECTED) {
//     delay(500);
//   }
//   Serial.println("Wi-Fi Conectado!");
//   client.setServer(mqttServer, mqttPort);

//   //Callback para receber mensagens MQTT
//   client.setCallback([](char* topic, byte* payload, unsigned int length){
//     String message = "";
//     for(int i = 0; i < length; i++){
//       message += (char)payload[i];
//     }

//   if(String(topic) == "luizG/iniciarJogo" && message == "start"){
//     // Reiniciar o jogo remotamente via MQTT
//     jogoAtivo = true;
//     perguntasRespondidas = 0;
//     acertos = 0;
//     erros = 0;
//     sorteiaPergunta();
//     mostrarPergunta();

//   }
// });

// // Subscrições MQTT
// client.subscribe("luizG/resp_enviada");
// client.subscribe("luizG/resultado");
// client.subscribe("luizG/statusAluno");
// client.subscribe("luizG/iniciarJogo");
// };

// void loop() {
//   // put your main code here, to run repeatedly:
//   delay(10); // this speeds up the simulation
// if(!client.connected()){
//   while(!client.connected()){
//     if(client.connect("ESP32-LuizG")){
//       Serial.println("MQTT Conectado!");
//   } else {
//     delay(1000);
//   }
//   }
// }

// client.loop();

// if(!jogoAtivo){
//   if(digitalRead(BTN_TRUE) == LOW || digitalRead(BTN_FALSE) == LOW) {
//     jogoAtivo = true;
//     perguntasRespondidas = 0;
//     acertos = 0;
//     erros = 0;
//     sorteiaPergunta();
//     mostrarPergunta();
//     delay(500);
//   } 
// } else{
//     if(digitalRead(BTN_TRUE) == LOW){
//       verificarResposta(true);
//       delay(500);
//     }
//     if(digitalRead(BTN_FALSE) == LOW) {
//       verificarResposta(false);
//       delay(500);
//     }
//   }
// }
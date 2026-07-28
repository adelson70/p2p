import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const esPath = path.join(__dirname, '../src/i18n/es.json');

/** Portuguese → Spanish (ordered: longer phrases first). */
const pairs = [
  ['Seus dados ficam no seu dispositivo.', 'Tus datos permanecen en tu dispositivo.'],
  ['Ferramentas no navegador com foco em privacidade. Sem contas, sem nuvem, sem coleta de dados.', 'Herramientas en el navegador centradas en la privacidad. Sin cuentas, sin nube, sin recopilación de datos.'],
  ['Início', 'Inicio'],
  ['Ferramentas', 'Herramientas'],
  ['Transferência', 'Transferencia'],
  ['Comunicação', 'Comunicación'],
  ['Colaboração', 'Colaboración'],
  ['Histórico', 'Historial'],
  ['Configurações', 'Ajustes'],
  ['Ferramentas no navegador que respeitam sua privacidade', 'Herramientas en el navegador que respetan tu privacidad'],
  ['Utilitários poderosos que rodam inteiramente no seu navegador. Sem upload. Sem rastreamento. Sem cadastro.', 'Utilidades potentes que se ejecutan por completo en tu navegador. Sin subidas. Sin rastreo. Sin registro.'],
  ['Enviar arquivos com PrivateDrop', 'Enviar archivos con PrivateDrop'],
  ['Ver todas as ferramentas', 'Ver todas las herramientas'],
  ['Todas as ferramentas', 'Todas las herramientas'],
  ['Todas', 'Todas'],
  ['Em breve', 'Próximamente'],
  ['Disponível', 'Disponible'],
  ['Envie arquivos de qualquer tamanho entre dispositivos sem subir para um servidor.', 'Envía archivos de cualquier tamaño entre dispositivos sin subirlos a un servidor.'],
  ['Chat e chamadas via conexões peer-to-peer.', 'Chat y llamadas por conexiones peer-to-peer.'],
  ['Mais recursos de comunicação podem vir em versões futuras.', 'Pueden llegar más funciones de comunicación en versiones futuras.'],
  ['Quadro branco e notas compartilhadas, local primeiro.', 'Pizarra y notas compartidas, primero en local.'],
  ['Ferramentas de colaboração virão em uma versão futura.', 'Pueden llegar más herramientas de colaboración en versiones futuras.'],
  ['Sessões armazenadas apenas neste dispositivo.', 'Sesiones guardadas solo en este dispositivo.'],
  ['Nenhuma sessão ainda.', 'Aún no hay sesiones.'],
  ['Limpe tudo em Configurações.', 'Borra todo en Ajustes.'],
  ['Papel', 'Rol'],
  ['Idioma, aparência e dados guardados só neste navegador.', 'Idioma, apariencia y datos guardados solo en este navegador.'],
  ['Idioma', 'Idioma'],
  ['Escolher idioma da interface', 'Elegir idioma de la interfaz'],
  ['Tema', 'Tema'],
  ['Sistema', 'Sistema'],
  ['Escuro', 'Oscuro'],
  ['Claro', 'Claro'],
  ['Dados neste dispositivo', 'Datos en este dispositivo'],
  ['Limpar todos os dados locais', 'Borrar todos los datos locales'],
  ['Isso remove preferências, histórico e cache de ferramentas deste navegador. Continuar?', 'Esto elimina preferencias, historial y caché de herramientas de este navegador. ¿Continuar?'],
  ['Dados locais removidos.', 'Datos locales eliminados.'],
  ['Quadro branco', 'Pizarra'],
  ['Como você entra?', '¿Cómo entras?'],
  ['Quem cria a sala compartilha o convite. A outra pessoa entra e devolve uma resposta.', 'Quien crea la sala comparte la invitación. La otra persona entra y devuelve una respuesta.'],
  ['Criar sala', 'Crear sala'],
  ['Entrar na sala', 'Entrar en la sala'],
  ['Você criou a sala', 'Creaste la sala'],
  ['Você está entrando na sala', 'Estás entrando en la sala'],
  ['Copiar convite', 'Copiar invitación'],
  ['Copiar resposta', 'Copiar respuesta'],
  ['Compartilhe com a outra pessoa', 'Comparte con la otra persona'],
  ['Código da outra pessoa', 'Código de la otra persona'],
  ['Aguardando pareamento', 'Esperando emparejamiento'],
  ['Conectando…', 'Conectando…'],
  ['Conectado', 'Conectado'],
  ['Conexão falhou', 'Conexión fallida'],
  ['Não foi possível conectar. Verifique os códigos e tente de novo.', 'No se pudo conectar. Comprueba los códigos e inténtalo de nuevo.'],
  ['Privacidade', 'Privacidad'],
  ['Sem contas. Sem nuvem. Sem rastreamento.', 'Sin cuentas. Sin nube. Sin rastreo.'],
  ['arquivos', 'archivos'],
  ['arquivo', 'archivo'],
  ['navegadores', 'navegadores'],
  ['navegador', 'navegador'],
  ['você', 'tú'],
  ['Você', 'Tú'],
  ['outra pessoa', 'la otra persona'],
  ['A outra pessoa', 'La otra persona'],
  ['sala', 'sala'],
  ['convite', 'invitación'],
  ['resposta', 'respuesta'],
  ['pareamento', 'emparejamiento'],
  ['servidor', 'servidor'],
  ['servidores', 'servidores'],
  ['Enviar', 'Enviar'],
  ['Baixar', 'Descargar'],
  ['Limpar', 'Borrar'],
  ['Desfazer', 'Deshacer'],
  ['Cor', 'Color'],
  ['Espessura', 'Grosor'],
  ['Sair do chat', 'Salir del chat'],
  ['Sair do quadro', 'Salir de la pizarra'],
  ['Digite uma mensagem…', 'Escribe un mensaje…'],
  ['Digitando…', 'Escribiendo…'],
  ['Anexar arquivo', 'Adjuntar archivo'],
  ['Escolher emoji', 'Elegir emoji'],
  ['Criptografado (DTLS)', 'Cifrado (DTLS)'],
];

let raw = fs.readFileSync(esPath, 'utf8');
for (const [from, to] of pairs) {
  raw = raw.split(from).join(to);
}
// Remaining PT-specific fixes
raw = raw
  .replace(/Voz e vídeo direto entre dois navegadores—sem contas nem servidor de chamadas./g,
    'Voz y vídeo directamente entre dos navegadores—sin cuentas ni servidor de llamadas.')
  .replace(/Quem inicia compartilha o convite\. A outra pessoa entra com esse convite e devolve uma resposta\./g,
    'Quien inicia la llamada comparte la invitación. La otra persona entra con esa invitación y devuelve una respuesta.')
  .replace(/Iniciar chamada \(criar convite\)/g, 'Iniciar llamada (crear invitación)')
  .replace(/Entrar na chamada/g, 'Entrar en la llamada')
  .replace(/Você iniciou a chamada/g, 'Iniciaste la llamada')
  .replace(/Você está entrando na chamada/g, 'Estás entrando en la llamada')
  .replace(/Chamada/g, 'Llamada')
  .replace(/chamada/g, 'llamada')
  .replace(/Em chamada/g, 'En llamada')
  .replace(/Silenciar/g, 'Silenciar')
  .replace(/Ativar microfone/g, 'Activar micrófono')
  .replace(/Desligar câmera/g, 'Apagar cámara')
  .replace(/Ligar câmera/g, 'Encender cámara')
  .replace(/Encerrar/g, 'Colgar')
  .replace(/Remoto/g, 'Remoto')
  .replace(/Chamada só áudio/g, 'Llamada solo audio')
  .replace(/Texto e arquivos direto entre dois navegadores—um link privado, sem servidor de chat\./g,
    'Texto y archivos directamente entre dos navegadores—un enlace privado, sin servidor de chat.')
  .replace(/Nenhuma mensagem ainda\. Diga olá\./g, 'Aún no hay mensajes. Di hola.')
  .replace(/Enviando arquivo…/g, 'Enviando archivo…')
  .replace(/Falha ao enviar arquivo/g, 'Error al enviar el archivo')
  .replace(/saíu do chat/g, 'salió del chat')
  .replace(/encerrou a chamada/g, 'colgó la llamada')
  .replace(/Quadro compartilhado entre dois navegadores—pareamento manual, sem servidor de canvas na nuvem\./g,
    'Lienzo compartido entre dos navegadores—emparejamiento manual, sin servidor de lienzo en la nube.')
  .replace(/Quadro/g, 'Lienzo')
  .replace(/quadro/g, 'lienzo')
  .replace(/Exportar PNG/g, 'Exportar PNG')
  .replace(/O que você vai fazer\?/g, '¿Qué vas a hacer?')
  .replace(/Quem envia cria a sala e compartilha o convite\. Quem recebe entra com esse convite e devolve uma resposta\./g,
    'Quien envía crea la sala y comparte la invitación. Quien recibe entra con esa invitación y devuelve una respuesta.')
  .replace(/Enviar arquivos \(criar sala\)/g, 'Enviar archivos (crear sala)')
  .replace(/Receber arquivos \(entrar na sala\)/g, 'Recibir archivos (entrar en la sala)')
  .replace(/Conectar dispositivos/g, 'Conectar dispositivos')
  .replace(/Você está enviando arquivos/g, 'Estás enviando archivos')
  .replace(/Você está recebendo arquivos/g, 'Estás recibiendo archivos')
  .replace(/Código da sala/g, 'Código de la sala')
  .replace(/Colar convite de quem envia/g, 'Pegar invitación de quien envía')
  .replace(/Colar resposta de quem recebe/g, 'Pegar respuesta de quien recibe')
  .replace(/Copiar dados de sinalização/g, 'Copiar datos de señalización')
  .replace(/Colar dados do outro dispositivo/g, 'Pegar datos del otro dispositivo')
  .replace(/Aplicar/g, 'Aplicar')
  .replace(/Entrar com dados colados/g, 'Entrar con datos pegados')
  .replace(/Escanear QR ou enviar imagem/g, 'Escanear QR o subir imagen')
  .replace(/Mostrar QR/g, 'Mostrar QR')
  .replace(/Ocultar QR/g, 'Ocultar QR')
  .replace(/Ler com câmera/g, 'Leer con cámara')
  .replace(/Aponte para o QR do outro dispositivo/g, 'Apunta al QR del otro dispositivo')
  .replace(/Fechar/g, 'Cerrar')
  .replace(/Cole o código de convite ou resposta/g, 'Pega el código de invitación o respuesta')
  .replace(/Compartilhe com o outro dispositivo/g, 'Comparte con el otro dispositivo')
  .replace(/Código do outro dispositivo/g, 'Código del otro dispositivo')
  .replace(/Copiado/g, 'Copiado')
  .replace(/Acesso à câmera negado ou indisponível\./g, 'Acceso a la cámara denegado o no disponible.')
  .replace(/Leitura de QR não é suportada neste navegador\./g, 'La lectura de QR no es compatible con este navegador.')
  .replace(/Solte arquivos aqui ou clique para escolher/g, 'Suelta archivos aquí o haz clic para elegir')
  .replace(/Fila de arquivos/g, 'Cola de archivos')
  .replace(/Iniciar transferência/g, 'Iniciar transferencia')
  .replace(/Progresso/g, 'Progreso')
  .replace(/Transferência concluída/g, 'Transferencia completada')
  .replace(/Enviar mais/g, 'Enviar más')
  .replace(/Aguardando arquivos de quem envia…/g, 'Esperando archivos de quien envía…')
  .replace(/Falha na conexão\. Verifique os dados de sinalização\./g, 'Fallo de conexión. Comprueba los datos de señalización.')
  .replace(/Se a conexão travar, copie dados atualizados após alguns segundos\./g, 'Si la conexión se atasca, copia datos actualizados tras unos segundos.')
  .replace(/Algumas redes bloqueiam conexões diretas\./g, 'Algunas redes bloquean conexiones directas.');

fs.writeFileSync(esPath, raw);
console.log('es.json updated');

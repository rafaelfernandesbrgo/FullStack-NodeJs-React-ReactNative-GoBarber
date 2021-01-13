# Recuperaçao de senha

**RF**
- O usuario deve poder recuperar sua senha informando o seu email;
- O usuario deve receber um email com instruções de recuperação de senha;
- O usuario deve poder resetar sua senha;

**RNF**
- utilizar mailtrap para testar envios em ambiente de dev;
- utilizar Amazon SES para envios em produção;
- O envio de email deve acontecer em segundo plano (background job);

**RN**
- O link enviado por email para resetar senha deve expirar em 2h;
- o usuario precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**
- O usuario deve poder atualizar seu nome, prefil e senha

**RN**
- o usuario nao pode alterar seu email para um email já utilizado;
- Para atualizar sua senha, o usuario deve informar a senha antiga;
- para atualizar sua senha, o usuario percisa confirmar a nova senha;

# Painel do Prestador

**RF**
- o usuario deve poder listar seus agendamentos de um dia especifico;
- o prestador deve receber uma notificação sempre que houver um novo agendamento;
- o prestador deve poder visualizar as notificações nao lidas;

**RNF**
- os agendamentos do prestador no dia devem ser armazendas em cache;
- as notificações do prestador devem ser armazenadas no MongoDB
    - para monstar bancos n relacionais
    - pois só texto, n necessidade de relacionamento
    - permite muitos dados de forma performatica
- as notificações do prestador devem ser enviadas em tempo-real utilizando Sokcket.io

**RN**
- a notificação deve ter um status de lida ou nao-lida para que o prestador possa controlar;

# Agendamento do serviços

**RF**
- O usuario deve poder listar todos prestadores de serviços cadastrados;
- O usuario deve poder listar os dias de um mes com pleno menos um horario disponivel de um prestador;
- O usuario deve poder listar horarios disponiveis em um dia especificio de um  prestador;
- o usuario deve poder realizar um novo agendamento com um prestador;

**RNF**
- a listagem de prestadores deve ser armazenada em cache;

**RN**
- cada agendamento deve durar 1h exatamente;
- os Agendamentos devem estar disponiveis entre 8h as 18h (primeiro às 8h , ultimo as 17h);
- o usuario nao pode agendar em um horario já ocupado;
- o usuario nao pode agendar em um horário que já passou;
- o usuario nao pode agendar serviços consigo msm;
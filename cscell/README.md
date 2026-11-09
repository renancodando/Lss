# CScell — site institucional

Front-end estático (HTML, CSS e JavaScript puro). Não precisa de build nem de servidor: basta publicar a pasta.

## Como personalizar

Todos os dados da loja ficam no início de `script.js`, no objeto `CONFIG`:

| Campo          | O que é                                              |
| -------------- | ---------------------------------------------------- |
| `whatsapp`     | Número com DDI e DDD, só dígitos (ex.: 5511912345678) |
| `telefone`     | Número como aparece no site                          |
| `instagram`    | Usuário sem o @                                      |
| `endereco`     | Rua, número e bairro                                 |
| `cidade`       | Cidade e UF                                          |
| `horario`      | Uma linha por item                                   |
| `garantiaDias` | Prazo de garantia mostrado no ticket e na seção      |

Logo abaixo ficam `BRANDS` (marcas do seletor) e `SERVICES` (serviços, prazos médios e o que cada um inclui). Ao editar `SERVICES`, o seletor do topo e a lista de serviços se atualizam juntos.

## Estrutura

- `index.html`: conteúdo e seções
- `style.css`: identidade visual (cores e tipografia definidas em `:root`)
- `script.js`: configuração, pré-ordem de serviço, lista de serviços e menu mobile

## Testar localmente

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.

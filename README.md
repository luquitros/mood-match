# Mood Match

Mood Match cruza o diario do Letterboxd com os charts semanais do Last.fm para
encontrar correlacoes entre filmes vistos e musica ouvida na mesma semana.

O app usa metadados do TMDB para enriquecer cada filme com generos e keywords,
transforma filmes e artistas em vetores de humor e calcula um score semanal de
similaridade.

## Stack

- Next.js 14 com App Router
- TypeScript
- Cheerio para scraping do diario do Letterboxd
- Last.fm API para `user.getWeeklyArtistChart` e tags de artistas
- TMDB API para generos e keywords de filmes
- Recharts para visualizacoes

## Rotas

- `/` - overview geral com highlights, score recente e timeline
- `/timeline` - evolucao semana a semana
- `/weeks/[year]/[week]` - detalhe de uma semana especifica
- `/insights` - padroes encontrados nos dados

## Como Rodar

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra:

```text
http://localhost:3000
```

## Variaveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```env
LETTERBOXD_USERNAME=your-letterboxd-user
LASTFM_USER=your-lastfm-user
LASTFM_API_KEY=your-lastfm-api-key
TMDB_API_KEY=your-tmdb-api-key
```

Sem essas variaveis, o app usa dados de exemplo para manter as telas navegaveis.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Modelo de Mood

O score compara dois vetores:

- mood dos filmes: generos, keywords e titulos vindos do TMDB/Letterboxd
- mood da musica: tags dos artistas mais ouvidos na semana no Last.fm

Os moods atuais sao:

- dark
- romantic
- energetic
- melancholic
- dreamy
- tense
- warm

O calculo usa similaridade de cosseno e retorna um score de 0 a 100.

## Status

Primeira versao funcional com rotas, integracoes, fallback de dados e graficos.
Proximos passos naturais: cache persistente, configuracao por usuario na UI e
insights mais estatisticos por genero/tag.

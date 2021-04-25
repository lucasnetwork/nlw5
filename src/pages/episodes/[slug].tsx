import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import api from '../../services/api'
import {format,parseISO} from 'date-fns'
import ptBr from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from './episode.module.scss'
import Image from 'next/image'
import Head from 'next/head'
import { PlayerContext, PlayerContextProvider, usePlayer } from '../../contexts/PlayerContext'
interface Episode{
    id:string;
    title:string;
    members:string;
    publishedAt:string;
    thumbnail:string;
    duration:number;
    description:string;
    durationAsString:string;
    url:string;
  }

  interface EpisodeProps{
      episode:Episode
  }

const Episode = ({episode}:EpisodeProps) =>{
    const {play} = usePlayer()
    return (
        <div className={styles.episode}>
            
        <Head>
          <title>{episode.title}</title>
        </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                <button type="button">
                    <img src="/arrow-left.svg" alt="voltar"/>
                </button>
                </Link>
                    <Image width={700} height={160} src={episode.thumbnail} objectFit="cover"/>
                    <button type="button" onClick={() =>play(episode)}>
                        <img src="/play.svg" alt="Tocar Episodios"/>
                    </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.descripion} dangerouslySetInnerHTML={{__html:episode.description}}/>
        </div>
    )
}

export const getStaticPaths:GetStaticPaths = async() =>{
    
    return {
        paths:[],
        fallback:'blocking'
    }
}

export const getStaticProps:GetStaticProps = async (ctx) => {
    const {slug} =  ctx.params
    const {data} = await api.get(`/episodes/${slug}`)

    const episode = {
        id:data.id,
        title:data.title,
        thumbnail:data.thumbnail,
        members:data.members,
        publishedAt: format(parseISO(data.published_at),'d MMM yy',{locale:ptBr}),
        duration:Number(data.file.duration),
        description:data.description,
        url:data.file.url,
        durationAsString:convertDurationToTimeString(Number(data.file.duration))
      }
    
    return (
        {
            props:{
                episode
            },
            revalidate:60*60*24 // 24 hours
        }
    )
}

export default Episode
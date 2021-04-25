import Image from 'next/image'
import { useContext, useEffect, useRef, useState } from 'react'
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext'
import styles from './styles.module.scss'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'

const Player = () => {
    const [progress,setProgress] = useState(0)

    function setupProgressListener(){
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate',() => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    const audioRef = useRef<HTMLAudioElement>(null)
    const { 
        currentEpisodeIndex,
        isLooping, toogleLoop,
        episodeList, isPlaying,
         togglePlay, setPlayingState,
         playNext,playPrevious,hasNext,
         hasPrevios,
        isShuffling,
    toggleShuffle,
clearPlayerState } =usePlayer()

    const episode = episodeList[currentEpisodeIndex]
    useEffect(() => {
        if (!audioRef.current) {
            return
        }
        if (isPlaying) {
            audioRef.current.play()
            return
        }
        audioRef.current.pause()

    }, [isPlaying])

    function handleSeek(amount:number){
        audioRef.current.currentTime = amount;
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext()
            return
        }
        clearPlayerState()
    }
    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="tocando agora" />
                <strong>Tocando agora</strong>
            </header>
            {
                episode ? (
                    <div className={styles.currentEpisode}>
                        <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (

                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um podcast para ouvir</strong>
                    </div>
                )
            }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                            onChange={handleSeek}
                            max={episode.duration}
                            value={progress}
                                trackStyle={{
                                    backgroundColor: '#04d361'
                                }}
                                railStyle={{
                                    backgroundColor: '#9f75ff'
                                }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) :
                            <div className={styles.emptySlider} />
                        }
                    </div>
                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>
                {
                    episode && (
                        <audio onEnded={handleEpisodeEnded} onLoadedMetadata={setupProgressListener} loop={isLooping} onPlay={() => setPlayingState(true)} onPause={() => setPlayingState(false)} ref={audioRef} src={episode.url} autoPlay />
                    )
                }
                <div className={styles.buttons}>
                    <button type="button" disabled={!episode || episodeList.length === 1} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" disabled={!episode || !hasPrevios} onClick={playPrevious}>
                        <img src="/play-previous.svg" alt="Tocar anterior" />
                    </button>
                    <button type="button" disabled={!episode} onClick={togglePlay} className={styles.playButton}>
                        {isPlaying ?
                            <img src="/pause.svg" alt="Tocar" />
                            :
                            <img src="/play.svg" alt="Tocar" />
                        }
                    </button>
                    <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
                        <img src="/play-next.svg" alt="Tocar próxima" />
                    </button>
                    <button type="button" disabled={!episode} onClick={toogleLoop} className={isLooping ? styles.isActive : ''}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}
export default Player
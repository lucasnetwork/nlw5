import lastDayOfWeekWithOptions from 'date-fns/fp/lastDayOfWeekWithOptions/index.js'
import {createContext,ReactNode,useContext,useState} from 'react'

interface Episode{
    title:string;
    members:string;
    thumbnail:string;
    duration:number;
    url:string
}

type PlayerContenxtData = {
    episodeList:Array<Episode>;
    currentEpisodeIndex:number;
    isPlaying:boolean;
    play:(episode:Episode)=>void;
    togglePlay:()=>void;
    setPlayingState:(state:boolean) => void;
    playList:(list:Array<Episode>,index:number) => void
    playPrevious:() =>void;
    playNext:() =>void;
    toogleLoop:() => void
    hasPrevios:boolean;
    hasNext:boolean;
    isLooping:boolean;
    toggleShuffle:() => void;
    isShuffling:boolean;
    clearPlayerState:() => void
  }

export const PlayerContext = createContext({} as PlayerContenxtData)

interface PlayerContextProviderProps{
  children:ReactNode
}

export function PlayerContextProvider({children}:PlayerContextProviderProps){
  const [episodeList,setEpisodeList] = useState([])
  const [currentEpisodeIndex,setCurrentEpisodeIndex] = useState(0)
  const [isPlaying,setIsPlaying] = useState(false)
  const [isLooping,setIsLooping] = useState(false)
  const [isShuffling,setIsShuffling] = useState(false)

  function play(episode:Episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  function toogleLoop(){
    setIsLooping(loop => !loop)
  }

  const hasPrevios = currentEpisodeIndex > 0;
  const hasNext =isShuffling || (currentEpisodeIndex+1) < episodeList.length

  function togglePlay(){
    setIsPlaying(props => !props)
  }
  function toggleShuffle(){
    setIsShuffling(shuffling => !shuffling)
  }

  function setPlayingState(state:boolean){
    setIsPlaying(state)
  }

  function playList(list:Array<Episode>,index:number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true)
  }

  function clearPlayerState(){
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  function playPrevious(){
    if(isShuffling){
      const nextRandoeEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeIndex(nextRandoeEpisodeIndex)
      return
    }
    if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex =>currentEpisodeIndex+1)
    }
  }

  function playNext(){
    if(hasPrevios){
      setCurrentEpisodeIndex(currentEpisodeIndex => currentEpisodeIndex-1)
    }
  }
  
  return (
    <PlayerContext.Provider 
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        hasPrevios,
        hasNext,
        toogleLoop,
        isLooping,
        toggleShuffle,
        isShuffling,
        clearPlayerState
      }}
      >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)

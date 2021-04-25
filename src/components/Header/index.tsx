import styles from './styles.module.scss'
import format from 'date-fns/format'
import ptBr from 'date-fns/locale/pt-BR'

const Header = () =>{
    const currentDate =format(new Date(),'EEEEE,E d MMMM',{
        locale:ptBr
    })
    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="podcast"/>

            <p>O melhor para você ouvir,sempre</p>

            <span>{currentDate}</span>
        </header>
    )
}
export default Header
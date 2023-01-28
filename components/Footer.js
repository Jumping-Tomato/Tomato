import styles from '../styles/Footer.module.scss'

export default function Footer() {
    return (
        <footer className={"row " + styles.footer}>
            <div className='col-lg-7 col-12 '>
            </div>
            <div className='col-lg-5 col-12'>
            Copyright © 2023 Jumping Tomato.com. All Rights Reserved. 
            </div>  
        </footer>
    )
}
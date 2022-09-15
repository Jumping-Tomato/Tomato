import styles from '../styles/Footer.module.scss'

export default function Footer() {
    return (
        <footer className={"row " + styles.footer}>
            <div className='col-lg-7 col-12 '>
            Website designed and developed by &nbsp;
            <a
                href="https://rongeegee.github.io"
                target="_blank"
                rel="noopener noreferrer">
                Rongan Li
            </a>
            </div>
            <div className='col-lg-5 col-12'>
            Copyright © 2022 Tomoto Inc. All Rights Reserved. 
            </div>  
        </footer>
    )
}
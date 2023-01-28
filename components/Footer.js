import styles from '../styles/Footer.module.scss'

export default function Footer() {
    return (
        <footer className={"row " + styles.footer}>
            <div className='col-lg-4 col-12'>
                <span style={{fontSize:"12px"}}>
                    Copyright © 2023 Jumping Tomato.com. All Rights Reserved. 
                </span>
            </div>
            <div className={'col-lg-8 col-12 row ' + styles.row}>
                <a href="/contact" className='col-lg-2'>
                    Contact Us
                </a>
                <a href="/pricing" className='col-lg-2'>
                    Pricing
                </a>
            </div>  
        </footer>
    )
}
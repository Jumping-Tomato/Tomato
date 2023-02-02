import styles from '../styles/Footer.module.scss'
import  Link  from 'next/link';

export default function Footer() {
    return (
        <footer className={"row " + styles.footer}>
            <div className='col-lg-4 col-12'>
                <span style={{fontSize:"12px"}}>
                    Copyright © 2023 Jumpingtomato.com. All Rights Reserved. 
                </span>
            </div>
            <div className={'col-lg-8 col-12 row ' + styles.row}>
                <Link href="/contact" legacyBehavior={false} className={'col-lg-2 ' + styles.link}>
                    Contact Us
                </Link>
                <Link href="/pricing" legacyBehavior={false} className={'col-lg-2 ' + styles.link}>
                    Pricing
                </Link>
            </div>  
        </footer>
    )
}
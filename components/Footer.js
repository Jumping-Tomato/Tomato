import styles from '../styles/Footer.module.scss'
import  Link  from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Teacher_membership_checker from './Teacher_membership_checker'

export default function Footer() {
    return (
        <>
            <footer className={styles.footer}>
                <div className="row">
                    <div className='col-lg-4 col-12'>
                        <span style={{fontSize:"12px"}}>
                            Copyright © 2023 Jumpingtomato.com. All Rights Reserved. 
                        </span>
                    </div>
                    <div className={'col-lg-8 col-12 row ' + styles.row}>
                        <Link href="/contact" legacyBehavior={false} className={'col-4 col-md-2' + ' ' +styles.link}>
                            Contact Us
                        </Link>
                        <Link href="/pricing" legacyBehavior={false} className={'col-4 col-md-2' + ' ' + styles.link}>
                            Pricing
                        </Link>
                        <Link href="/privacy-policy" legacyBehavior={false} className={'col-4 col-md-2' + ' ' + styles.link}>
                            Privacy Policy
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className='col-12'>
                        <span style={{fontSize:"12px"}}>
                            Made with <FontAwesomeIcon icon={faHeart} size="1x" /> in NYC
                        </span>
                    </div>
                </div>
            </footer>
            <Teacher_membership_checker />
        </>
    )
}
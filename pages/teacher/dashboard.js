import { useSession } from 'next-auth/react'
import Head from 'next/head'
import global from 'styles/Global.module.scss'
import Topbar from 'components/Topbar'
import Footer from 'components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import  Link  from 'next/link';

export default function TeacherDashboard() {
    const { data: session } = useSession();
    return(
        <>
            <Topbar />
            <div className={global.container}>
                <Head>
                    <title>Dashboard Page - {session ? session.role : ""}</title>
                    <meta name="description" content="Home Page" />
                    <link rel="icon" href="#" />
                </Head>

                <main className={global.main}>
                    <div className='row'>
                        <div className="col-12 pt-1">
                            <div className="col-12 pt-5">
                                <Link href="/teacher/createCourse">
                                    <button type="button" className="float-end btn btn-primary">
                                        <FontAwesomeIcon icon={faPlus} size="1x" />&nbsp;
                                        Create
                                    </button>
                                </Link>
                            </div>
                            <div className="col-12 pt-5">
                                {/* this will be a list of exam */}
                                <ul class="list-group">
                                    <li class="list-group-item">Cras justo odio</li>
                                    <li class="list-group-item">Dapibus ac facilisis in</li>
                                    <li class="list-group-item">Morbi leo risus</li>
                                    <li class="list-group-item">Porta ac consectetur ac</li>
                                    <li class="list-group-item">Vestibulum at eros</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
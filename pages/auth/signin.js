import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { signIn } from "next-auth/react";

export default Login;

function Login() {
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        email: Yup.string().required('mail is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit({ email, password }) {
        try{
            const res = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false,
            });
            router.push("/")
        }
        catch(error){
            console.error(error);
        }
        
        
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.email?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Login
                        </button>
                        <Link href="/account/register" className="btn btn-link">Register</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
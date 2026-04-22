import { useState, useContext } from 'react';
import { MyContext } from './MyContext.jsx';
import api from './api.js';
import './Login.css';

export default function Login() {
    const { login } = useContext(MyContext);
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setError('');
        try {
            const endpoint = isRegister ? '/auth/register' : '/auth/login';
            const payload = isRegister ? { name, email, password } : { email, password };
            const res = await api.post(endpoint, payload);
            login(res.data.token, res.data.user);
            // no navigate needed — App.jsx handles it
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong');
        }
    };

    return (
        <div className='loginPage'>
            <h2>{isRegister ? 'Register' : 'Login'}</h2>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {isRegister && (
                    <input placeholder='Name' value={name} onChange={e => setName(e.target.value)} />
                )}
                <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} />

                {error && <p className='error'>{error}</p>}

                <button type='submit'>{isRegister ? 'Register' : 'Login'}</button>
            </form>

            <p onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </p>
        </div>
    );
}
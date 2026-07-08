const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const session = require('express-session');
const app = express();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'super-secret', resave: false, saveUninitialized: true }));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const { data } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
    if (data) {
        req.session.user = username;
        res.sendFile(__dirname + '/public/dashboard.html');
    } else { res.send('Login Failed'); }
});

app.post('/update-credentials', async (req, res) => {
    const { newUsername, newPassword } = req.body;
    await supabase.from('users').update({ username: newUsername, password: newPassword }).eq('username', req.session.user);
    res.send('Credentials updated! Please refresh.');
});

app.listen(process.env.PORT || 3000);

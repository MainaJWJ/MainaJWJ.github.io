const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// DB 파일 읽기 (파일 없으면 기본 구조로 생성)
async function getDb() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            const defaultDb = { board1: [], board2: [] };
            await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2));
            return defaultDb;
        }
        throw error;
    }
}

// 게시판 ID 유효성 검사
function isValidBoard(board) {
    return board === 'board1' || board === 'board2';
}

// 모든 게시글 조회 (GET /posts)
app.get('/posts', async (req, res) => {
    try {
        const { board = 'board1', page = 1, limit = 10, search = '' } = req.query;
        if (!isValidBoard(board)) {
            return res.status(400).send('유효하지 않은 게시판입니다.');
        }

        const db = await getDb();
        let posts = db[board] || [];

        if (search) {
            posts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        }

        posts.sort((a, b) => b.id - a.id);

        const startIndex = (page - 1) * limit;
        const paginatedPosts = posts.slice(startIndex, startIndex + parseInt(limit));

        res.json({
            posts: paginatedPosts,
            totalPages: Math.ceil(posts.length / limit),
            currentPage: parseInt(page, 10)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

// 특정 게시글 조회 (GET /posts/:id)
app.get('/posts/:id', async (req, res) => {
    try {
        const { board = 'board1' } = req.query;
        if (!isValidBoard(board)) {
            return res.status(400).send('유효하지 않은 게시판입니다.');
        }
        const postId = parseInt(req.params.id, 10);
        const db = await getDb();
        const post = (db[board] || []).find(p => p.id === postId);

        if (post) {
            res.json(post);
        } else {
            res.status(404).send('해당 ID의 게시글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

// 새 게시글 저장 (POST /posts)
app.post('/posts', async (req, res) => {
    try {
        const { board = 'board1' } = req.query;
        if (!isValidBoard(board)) {
            return res.status(400).send('유효하지 않은 게시판입니다.');
        }
        const db = await getDb();
        const newPost = {
            id: Date.now(),
            title: req.body.title,
            content: req.body.content,
            createdAt: new Date().toISOString(),
        };
        db[board].push(newPost);
        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

// 게시글 수정 (PUT /posts/:id)
app.put('/posts/:id', async (req, res) => {
    try {
        const { board = 'board1' } = req.query;
        if (!isValidBoard(board)) {
            return res.status(400).send('유효하지 않은 게시판입니다.');
        }
        const postId = parseInt(req.params.id, 10);
        const db = await getDb();
        const postIndex = (db[board] || []).findIndex(p => p.id === postId);

        if (postIndex === -1) {
            return res.status(404).send('해당 ID의 게시글을 찾을 수 없습니다.');
        }

        const updatedPost = { ...db[board][postIndex], title: req.body.title, content: req.body.content };
        db[board][postIndex] = updatedPost;

        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

// 게시글 삭제 (DELETE /posts/:id)
app.delete('/posts/:id', async (req, res) => {
    try {
        const { board = 'board1' } = req.query;
        if (!isValidBoard(board)) {
            return res.status(400).send('유효하지 않은 게시판입니다.');
        }
        const postId = parseInt(req.params.id, 10);
        const db = await getDb();
        const initialLength = (db[board] || []).length;
        db[board] = (db[board] || []).filter(post => post.id !== postId);

        if (db[board].length === initialLength) {
            return res.status(404).send('해당 ID의 게시글을 찾을 수 없습니다.');
        }

        await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
        res.status(200).send({ message: '게시글이 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});


const open = require('open');

// 서버 실행
app.listen(PORT, '0.0.0.0', () => {
    const url = `http://localhost:${PORT}`;
    console.log(`서버가 ${url} 에서 실행 중입니다.`);
    console.log('이제 외부에서도 접속할 수 있습니다. (방화벽 및 포트 포워딩 필요)');
    open(url);
});

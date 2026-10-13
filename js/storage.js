// LocalStorage Management for Students, Scores, Custom Questions, and API Keys

const STORAGE_KEYS = {
    STUDENTS: 'rba_students_list',
    ACTIVE_STUDENT: 'rba_active_student_id',
    SCORES: 'rba_student_scores',
    CUSTOM_QUESTIONS: 'rba_custom_questions',
    API_KEY: 'rba_gemini_api_key'
};

// 1. Get List of Students
function getStudents() {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
        const defaultStudent = [{ id: 's_1', nama: 'Budi Santoso', kelas: 'Kelas 2 SD / Fase A', nisn: '01', sekolah: 'SD Negeri Merdeka' }];
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudent));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, 's_1');
        return defaultStudent;
    }
    return JSON.parse(raw);
}

function saveStudent(studentObj) {
    const students = getStudents();
    students.push(studentObj);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    setActiveStudentId(studentObj.id);
}

function getActiveStudentId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT) || 's_1';
}

function setActiveStudentId(id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, id);
}

function getActiveStudent() {
    const students = getStudents();
    const activeId = getActiveStudentId();
    return students.find(s => s.id === activeId) || students[0];
}

// 2. Scores & Diagnostic History
function getScores() {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    return raw ? JSON.parse(raw) : {};
}

function saveQuizScore(studentId, subjectName, score, totalQuestions) {
    const scores = getScores();
    if (!scores[studentId]) scores[studentId] = {};
    
    const percentage = Math.round((score / totalQuestions) * 100);

    scores[studentId][subjectName] = {
        score: score,
        total: totalQuestions,
        percentage: percentage,
        stars: Math.round((score / totalQuestions) * 5),
        date: new Date().toLocaleDateString('id-ID')
    };
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
}

// 3. Custom Questions Bank (Soal Guru)
function getCustomQuestions() {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUESTIONS);
    return raw ? JSON.parse(raw) : [];
}

function saveCustomQuestion(qObj) {
    const list = getCustomQuestions();
    list.push(qObj);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUESTIONS, JSON.stringify(list));
}

// 4. API Key
function getGeminiApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

function saveGeminiApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
}
// LocalStorage Management for Students, Scores, and API Key

const STORAGE_KEYS = {
    STUDENTS: 'rba_students_list',
    ACTIVE_STUDENT: 'rba_active_student_id',
    SCORES: 'rba_student_scores',
    API_KEY: 'rba_gemini_api_key'
};

// 1. Get List of Students
function getStudents() {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
        // Default initial student
        const defaultStudent = [{ id: 's_1', nama: 'Budi Santoso', kelas: 'Kelas 2 SD / Fase A', nisn: '01', sekolah: 'SD Negeri Merdeka' }];
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(defaultStudent));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT, 's_1');
        return defaultStudent;
    }
    return JSON.parse(raw);
}

// 2. Save New Student
function saveStudent(studentObj) {
    const students = getStudents();
    students.push(studentObj);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    setActiveStudentId(studentObj.id);
}

// 3. Active Student
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

// 4. Scores Management
function getScores() {
    const raw = localStorage.getItem(STORAGE_KEYS.SCORES);
    return raw ? JSON.parse(raw) : {};
}

function saveQuizScore(studentId, subjectName, score, totalQuestions) {
    const scores = getScores();
    if (!scores[studentId]) scores[studentId] = {};
    
    scores[studentId][subjectName] = {
        score: score,
        total: totalQuestions,
        stars: Math.round((score / totalQuestions) * 5),
        date: new Date().toLocaleDateString('id-ID')
    };
    localStorage.setItem(STORAGE_KEYS.SCORES, JSON.stringify(scores));
}

// 5. API Key Management
function getGeminiApiKey() {
    return localStorage.getItem(STORAGE_KEYS.API_KEY) || '';
}

function saveGeminiApiKey(key) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, key.trim());
}
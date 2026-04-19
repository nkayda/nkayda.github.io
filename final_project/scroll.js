const scrollProgress = document.getElementById('scroll-progress');
const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
const train = document.getElementById('train-nav');

window.addEventListener('scroll', () => {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    scrollProgress.style.width = `${(scrollTop / height) * 100}%`;
});
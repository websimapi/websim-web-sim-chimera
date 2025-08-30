import { room } from '~/src/db.js';

export const fetchLatestMerge = async (setLoadingMessage) => {
    setLoadingMessage('Fetching latest creation...');
    const latest = await room.query("SELECT * FROM public.merges_v2 ORDER BY created_at DESC LIMIT 1").getList();
    if (latest && latest.length > 0) {
        return latest[0];
    }
    return null;
};

export const createNewMerge = async (latestMerge, setLoadingMessage) => {
    try {
        setLoadingMessage('Fetching trending projects...');
        const response = await fetch(`https://websim.com/api/v1/projects/trending?limit=10`);
        const { data } = await response.json();
        const projects = data.map(p => p.project);

        if (projects.length < 2) {
            setLoadingMessage('Not enough projects to merge. Waiting...');
            return null;
        }

        const project1 = projects[Math.floor(Math.random() * projects.length)];
        let project2 = projects[Math.floor(Math.random() * projects.length)];
        while (project2.id === project1.id) {
            project2 = projects[Math.floor(Math.random() * projects.length)];
        }
        
        setLoadingMessage(`Fetching code for ${project1.title} and ${project2.title}...`);

        const [code1Res, code2Res] = await Promise.all([
            fetch(`https://websim.com/api/v1/projects/${project1.id}/files`),
            fetch(`https://websim.com/api/v1/projects/${project2.id}/files`)
        ]);
        const code1 = await code1Res.json();
        const code2 = await code2Res.json();

        const p1Files = {
            html: code1.files['index.html'] || '',
            css: code1.files['styles.css'] || '',
            js: Object.entries(code1.files).find(([name]) => name.endsWith('.js') || name.endsWith('.jsx'))?.[1] || ''
        };
        const p2Files = {
            html: code2.files['index.html'] || '',
            css: code2.files['styles.css'] || '',
            js: Object.entries(code2.files).find(([name]) => name.endsWith('.js') || name.endsWith('.jsx'))?.[1] || ''
        };
        
        setLoadingMessage('AI is merging the code... This can take a moment.');

        const completion = await websim.chat.completions.create({
            messages: [
                { role: 'system', content: `You are an expert web developer AI. Your task is to merge two web applications into a single, functional, and creative one.
Combine the HTML, CSS, and JavaScript from both projects. The resulting application must be a single self-contained HTML file. Put CSS in a <style> tag and JS in a <script> tag within the HTML.
Do NOT use external libraries unless they are imported via an ESM CDN like esm.sh. Do not assume any files exist.
The result should be visually interesting and functionally coherent.
Respond ONLY with a JSON object with the keys "html", "css", and "js". Do not include any other text or explanations.`},
                { role: 'user', content: `Project 1 (${project1.title}):\nHTML:\n\`\`\`html\n${p1Files.html}\n\`\`\`\nCSS:\n\`\`\`css\n${p1Files.css}\n\`\`\`\nJS:\n\`\`\`javascript\n${p1Files.js}\n\`\`\`
                ` }
            ],
            json: true,
        });

        const result = JSON.parse(completion.content);

        setLoadingMessage('Saving new creation...');
        const newMerge = await room.collection('merges_v2').create({
            generation: (latestMerge?.generation || 0) + 1,
            source_projects: [
                { id: project1.id, title: project1.title },
                { id: project2.id, title: project2.title }
            ],
            html_code: result.html || '',
            css_code: result.css || '',
            js_code: result.js || '',
        });

        return newMerge;
    } catch (error) {
        console.error("Error creating new merge:", error);
        setLoadingMessage(`An error occurred. Retrying in 10s. Error: ${error.message}`);
        return null;
    }
};
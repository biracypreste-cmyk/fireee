
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'sonner@2.0.3': 'sonner',
        'react-hook-form@7.55.0': 'react-hook-form',
        'library@version': 'library',
        'figma:asset/c4223b8066da97c61f128789c252a8caf4958c77.png': path.resolve(__dirname, './src/assets/c4223b8066da97c61f128789c252a8caf4958c77.png'),
        'figma:asset/5e96d00ffd8de4d3e66f643c8e1775de83b4b2fd.png': path.resolve(__dirname, './src/assets/5e96d00ffd8de4d3e66f643c8e1775de83b4b2fd.png'),
        'figma:asset/50b5e1768b3d18d953fbe09d51b750351c2b6f2d.png': path.resolve(__dirname, './src/assets/50b5e1768b3d18d953fbe09d51b750351c2b6f2d.png'),
        'figma:asset/3b5a8f9baf8da771f5eb688450c14d598e835ea6.png': path.resolve(__dirname, './src/assets/3b5a8f9baf8da771f5eb688450c14d598e835ea6.png'),
        'figma:asset/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png': path.resolve(__dirname, './src/assets/0fd04bd0f4dd3d36db506b272ad022b23cf78263.png'),
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
    },
    server: {
      port: 3000,
      open: true,
    },
  });
import { config } from 'dotenv';
config();

import '@/ai/flows/product-recommendations.ts';
import './flows/analyze-product-flow';
import './flows/generate-image-prompt-flow';
import './flows/generate-description-flow';
import './flows/analyze-image-style-flow';

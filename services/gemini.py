import json
import logging
from dataclasses import dataclass, field
from groq import AsyncGroq
from config import GROQ_API_KEY, GROQ_MODEL, BUILD_SYSTEM_PROMPT

logger = logging.getLogger(__name__)

_client = AsyncGroq(api_key=GROQ_API_KEY)


@dataclass
class BuildContext:
    descrizione: str
    tema: str
    audience: str = field(default="")
    tono: str = field(default="")
    esigenze: str = field(default="")

    def to_prompt(self) -> str:
        parts = [f"Descrizione: {self.descrizione}", f"Tema/nicchia: {self.tema}"]
        if self.audience:
            parts.append(f"Pubblico: {self.audience}")
        if self.tono:
            parts.append(f"Tono: {self.tono}")
        if self.esigenze:
            parts.append(f"Esigenze specifiche: {self.esigenze}")
        return "\n".join(parts)


async def generate(prompt: str) -> str:
    response = await _client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.choices[0].message.content


async def generate_server_structure(context: BuildContext) -> dict:
    try:
        response = await _client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": BUILD_SYSTEM_PROMPT},
                {"role": "user", "content": context.to_prompt()},
            ],
            response_format={"type": "json_object"},
        )
        data = json.loads(response.choices[0].message.content)
        if "categorie" not in data or not isinstance(data["categorie"], list):
            raise ValueError("Struttura JSON non valida")
        return data
    except json.JSONDecodeError as e:
        logger.error("Groq JSON decode error: %s", e)
        raise RuntimeError("Risposta AI non valida. Riprova.")
    except RuntimeError:
        raise
    except Exception as e:
        logger.error("Groq error: %s", e)
        raise RuntimeError(f"Errore generazione struttura: {e}")

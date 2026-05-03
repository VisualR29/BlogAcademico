import { useEffect, useMemo, useState } from 'react'
import './App.css'

const EXTERNAL = 'noopener noreferrer'

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.js-reveal')
    if (!els.length || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('revealed'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('revealed')
        })
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function scrollToSection(id) {
  const el = document.getElementById(id)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function YouTubeEmbed({ id, title }) {
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0`
  return (
    <div className="embedWrap">
      <iframe
        className="embed"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

function ResourceLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel={EXTERNAL}>
      {children}
    </a>
  )
}

/** Actividad 1 */
function DetectivesActivity() {
  const items = [
    {
      texto:
        'Un alumno nuevo es ignorado sistemáticamente en los trabajos en equipo porque “habla distinto”.',
      tipo: 'viola',
    },
    {
      texto:
        'En la biblioteca hay acceso igualitario a libros digitales los mismos horarios para todos.',
      tipo: 'respeta',
    },
    {
      texto:
        'Una persona espera desde horas muy temprano para tener turno ante un servicio público urgente.',
      tipo: 'duda',
    },
    {
      texto:
        'Negar información clara sobre un trámite a quien pertenece a un grupo discriminado históricamente.',
      tipo: 'viola',
    },
  ]

  const [eleccion, setEleccion] = useState(() => Object.fromEntries(items.map((_, i) => [i, null])))
  const [mostrar, setMostrar] = useState(() => Object.fromEntries(items.map((_, i) => [i, false])))

  const etiqueta = {
    respeta: 'Se interpreta habitualmente como respeto que fortalece la dignidad.',
    viola: 'Suele leerse como posible vulneración; conviene revisar contexto y vías de denuncia o apoyo.',
    duda: 'Depende de datos y contexto: aquí vale documentar lo observado y buscar fuentes confiables.',
  }

  return (
    <div className="activity">
      <p className="activityLead">
        Lee cada caso y marca si sugieren respeto, violación de derechos o si necesitas más información.
      </p>
      <div className="activityStack">
        {items.map((it, i) => (
          <div key={i} className="miniCard">
            <p className="scenario">{it.texto}</p>
            <div className="btnRow" role="group" aria-label="Clasificación del caso">
              {[
                ['respeta', 'Respetan'],
                ['viola', 'Violan'],
                ['duda', 'Necesito más información'],
              ].map(([v, lab]) => (
                <button
                  key={v}
                  type="button"
                  className={`pill ${eleccion[i] === v ? 'pill--active' : ''}`}
                  onClick={() =>
                    setEleccion((prev) => ({
                      ...prev,
                      [i]: prev[i] === v ? null : v,
                    }))
                  }
                >
                  {lab}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="textBtn"
              onClick={() => setMostrar((p) => ({ ...p, [i]: !p[i] }))}
              aria-expanded={mostrar[i]}
            >
              {mostrar[i] ? 'Ocultar pista' : 'Mostrar orientación'}
            </button>
            {mostrar[i] && (
              <p className={`hint hint--${it.tipo}`}>
                <strong>{etiqueta[it.tipo]}</strong>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Actividad 2 */
function EspectadorCiudadanoActivity() {
  const parejas = [
    {
      espectador: 'Se queja del parque sucio pero nunca ayuda ni propone reuniones.',
      ciudadano:
        'Coordina voluntarios, habla con autoridades locales y lleva evidencia fotográfica con fechas.',
    },
    {
      espectador: 'Comparte viralmente críticas sin verificar datos ni proponer acciones.',
      ciudadano:
        'Verifica información, acude a espacios de participación institucidos y arma propuestas concretas.',
    },
  ]

  const [idx, setIdx] = useState(0)

  return (
    <div className="activity">
      <div className="toggleHead">
        <span className="badge">Contraste guiado</span>
        <div className="stepNav">
          {parejas.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`stepDot ${i === idx ? 'stepDot--on' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={`Par de ejemplos ${i + 1}`}
            />
          ))}
        </div>
      </div>
      <div className="compareGrid">
        <article className="comparePane compare-pane--muted">
          <h4 className="compareTitle">Modo espectador</h4>
          <p>{parejas[idx].espectador}</p>
        </article>
        <article className="comparePane compare-pane--accent">
          <h4 className="compareTitle">Modo ciudadano activo</h4>
          <p>{parejas[idx].ciudadano}</p>
        </article>
      </div>
      <button type="button" className="primary ghost" onClick={() => setIdx((i) => (i + 1) % parejas.length)}>
        Ver otro ejemplo
      </button>
    </div>
  )
}

/** Actividad 3 */
function TipoCiudadanoActivity() {
  const preguntas = [
    {
      q: 'Ante una injusticia local, ¿qué te resulta más natural?',
      a: [
        { t: 'Cumplo mis obligaciones sin meterme en líos.', p: [1, 0, 0] },
        {
          t: 'Busco involucrar a otros y proponer acciones colectivas.',
          p: [0.3, 1, 0.2],
        },
        {
          t: 'Intento revisar causas profundas y apuntar cambios más amplios.',
          p: [0.5, 0.6, 1],
        },
      ],
    },
    {
      q: '¿Cómo relacionas tus decisiones cotidianas con el bien común?',
      a: [
        { t: 'Priorizo seguridad personal y cercanía inmediata.', p: [1, 0, 0] },
        {
          t: 'Equilibro tiempo personal con voluntariado puntual.',
          p: [0.5, 1, 0.4],
        },
        {
          t: 'Pienso políticas públicas incluso cuando no parecen “mis” problemas.',
          p: [0.6, 0.9, 1],
        },
      ],
    },
    {
      q: 'Si una norma parece sesgada, tiendes a…',
      a: [
        { t: 'Ajustarme porque “así están las cosas”.', p: [0.8, 0, 0] },
        { t: 'Movilizarme con vecinas y vecinos.', p: [0.2, 1, 0.3] },
        { t: 'Conectar causas locales con marcos jurídicos y éticos.', p: [0.2, 0.5, 1] },
      ],
    },
    {
      q: 'Imagina líderar un proyecto comunitario. ¿Tu foco inicial sería?',
      a: [
        { t: 'Logísticas y cumplimiento de cronogramas.', p: [1, 0.3, 0.2] },
        { t: 'Participación igualitaria en decisiones.', p: [0.3, 1, 0.4] },
        { t: 'Justicia distributiva del beneficio esperado.', p: [0.3, 0.6, 1] },
      ],
    },
  ]

  const [resp, setResp] = useState(() => [])
  const [step, setStep] = useState(0)

  const sum =
    resp.length >= preguntas.length
      ? resp.reduce(
          (acc, r) => {
            const p = r.p
            return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]]
          },
          [0, 0, 0]
        )
      : null

  const perfil =
    sum &&
    ['Responsabilidad institucional y cumplimiento', 'Participación y organización comunitaria', 'Orientación a la justicia estructural'][
      sum.indexOf(Math.max(...sum))
    ]

  return (
    <div className="activity">
      {step < preguntas.length && (
        <div className="quizCard">
          <p className="quizCount">
            Pregunta {step + 1} de {preguntas.length}
          </p>
          <p className="quizQ">{preguntas[step].q}</p>
          <div className="quizOpts">
            {preguntas[step].a.map((op, i) => (
              <button
                key={i}
                type="button"
                className="quizOpt"
                onClick={() => {
                  setResp((prev) => {
                    const next = [...prev]
                    next[step] = op
                    return next
                  })
                  setStep((s) => s + 1)
                }}
              >
                {op.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {step >= preguntas.length && (
        <div className="resultCard">
          <p className="quizCount">Tu tendencia destacada es…</p>
          <p className="quizResult">{perfil}</p>
          <p className="smallPrint">
            Actividad formativa sin validez científica. Sirve solo para ordenar tus intuiciones sobre roles
            ciudadanos.
          </p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              setResp([])
              setStep(0)
            }}
          >
            Repetir actividad
          </button>
        </div>
      )}
    </div>
  )
}

/** Actividad 4 */
function ReflexionVivirBien() {
  const [texto, setTexto] = useState('')
  const prompts = useMemo(
    () => [
      '¿Mis metas están alineadas con lo que me da sentido?',
      '¿Dedico tiempo suficiente a relaciones nutritivas?',
      '¿Percibo síntomas constantes de agotamiento aun cuando “sale todo bien”?',
    ],
    []
  )

  const [picked, setPicked] = useState(() => new Set())

  return (
    <div className="activity">
      <p className="activityLead">
        Anota líneas cortas sobre cada disparador que elijas. Nadie revisará este texto desde la página; es solo
        para ti.
      </p>
      <div className="chipRow">
        {prompts.map((p, i) => (
          <button
            key={i}
            type="button"
            className={`chip ${picked.has(i) ? 'chip--on' : ''}`}
            onClick={() =>
              setPicked((prev) => {
                const n = new Set(prev)
                if (n.has(i)) n.delete(i)
                else n.add(i)
                return n
              })
            }
          >
            Disparador {i + 1}
          </button>
        ))}
      </div>
      <ul className="promptList">
        {picked.size === 0 && <li className="muted">Selecciona al menos un disparador para ver la pregunta.</li>}
        {prompts.map(
          (p, i) =>
            picked.has(i) && (
              <li key={i}>
                <strong>{p}</strong>
              </li>
            )
        )}
      </ul>
      <label className="areaLabel">
        Tu reflexión privada
        <textarea
          className="area"
          rows={5}
          value={texto}
          placeholder="Aquí puede ir una lista de frases cortas con lo que necesitas reconsiderar durante la siguiente semana…"
          onChange={(e) => setTexto(e.target.value)}
        />
      </label>
      <p className="charCount">{texto.length} caracteres</p>
    </div>
  )
}

/** Actividad 5 */
function BalanzaActivity() {
  const cfg = [
    { id: 'trabajo', label: 'Energía en obligaciones formales ↔ descanso y cuidados', minLabel: 'Más trabajo', maxLabel: 'Más descanso' },
    { id: 'redes', label: 'Tiempo digital ↔ presencia física cara a cara', minLabel: 'Más redes', maxLabel: 'Más presencia presencial' },
    { id: 'com', label: 'Autonomía ↔ compromiso colectivo', minLabel: 'Más Individual', maxLabel: 'Más comunidad' },
  ]
  const [vals, setVals] = useState({ trabajo: 50, redes: 50, com: 50 })

  const mensajes = []
  if (vals.trabajo < 38) mensajes.push('Detectas alta carga hacia obligaciones formales.')
  else if (vals.trabajo > 62)
    mensajes.push('Valoras tiempo de reposo deliberado.')

  if (vals.redes < 38)
    mensajes.push('Percibes alta exposición digital.')
  else if (vals.redes > 62) mensajes.push('Prioritas encuentros físicos conscientes.')

  if (vals.com < 38) mensajes.push('Refuerzas autonomías personales marcadas.')
  else if (vals.com > 62) mensajes.push('Amplificas acciones pensadas desde el vínculo comunitario.')

  if (!mensajes.length)
    mensajes.push('Las tres dimensiones muestran un equilibrio intermedio. El justo medio se revisa día a día, no solo una vez.')

  return (
    <div className="activity">
      <div className="balanceVisual" aria-hidden>
        <span className="beam" />
        <span className="pivot" />
        <span className={`pan pan--left ${vals.com < 50 ? 'pan--heavy' : ''}`} />
        <span className={`pan pan--right ${vals.com >= 50 ? 'pan--heavy' : ''}`} />
      </div>

      <div className="sliders">
        {cfg.map((c) => (
          <div key={c.id} className="sliderRow">
            <div className="sliderHead">
              <span>{c.label}</span>
              <span className="tinyVals">
                {c.minLabel} · {vals[c.id]} · {c.maxLabel}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={vals[c.id]}
              onChange={(e) =>
                setVals((v) => ({
                  ...v,
                  [c.id]: Number(e.target.value),
                }))
              }
            />
          </div>
        ))}
      </div>

      <aside className="balanceReadout">{mensajes.join(' ')}</aside>
    </div>
  )
}

const SUBTEMAS = [
  {
    id: 'dh',
    num: '01',
    title: 'Derechos humanos en la vida real',
    idea:
      'Los derechos humanos adquieren peso ético cuando dejan de ser eslogan y se traducen en atención cotidiana a la dignidad ajena.',
    body: (
      <>
        <p>
          Los instrumentos internacionales dan marco y vocabulario común, pero el contraste entre el discurso normativo y las
          experiencias vividas suele ser revelador: no todas las personas reciben el mismo trato, ni acceden en igualdad de
          condiciones a servicios o espacios decisivos para su desarrollo. Formarse en derechos implica, por tanto, ejercitar la
          capacidad de observar contextos concretos y preguntarse si lo que ocurre respeta o erosiona la persona como fin, no solo
          como administrado o usuario de un trámite.
        </p>
        <p>
          Desde una perspectiva aplicada, el valor práctico del tema aparece cuando cultivamos sensibilidad ante situaciones que
          antes pasaban inadvertidas: exclusiones sutiles, tratamientos degradantes o omisiones institucionales que reproducen
          desigualdad. La responsabilidad ética no se agota en conocer listados; se fortalece al elegir no mirar hacia otro lado:
          intervenir con medidas proporcionadas, acompañar, documentar con rigor o apoyar canales formales cuando correspondan.
          Muchas veces el punto de partida es modesto —un trato respetuoso, una mediación informada— pero es precisamente en lo
          cotidiano donde se consolidan culturas de respeto o, por el contrario, su normalización silenciosa.
        </p>
      </>
    ),
    ejemplo: (
      <>
        Ejemplo práctico: en el entorno educativo, situaciones como la{' '}
        <strong>exclusión recurrente de un estudiante por rasgos lingüísticos o de origen</strong>, o la{' '}
        <strong>asimetría sistemática en el acceso a orientación, tecnología o materiales de calidad</strong>, pueden leerse como
        tensiones entre el principio de igualdad y la práctica institucional —un campo donde conviene combinar empatía,
        protocolos y seguimiento.
      </>
    ),
    links: [
      [
        'Pedagogía de la Declaración Universal (Naciones Unidas)',
        'https://www.un.org/es/documents/udhr/pedagogy.shtml',
      ],
      [
        'Instrumentos internacionales en derechos humanos (UNESCO)',
        'https://www.unesco.org/es/node/66640',
      ],
    ],
    videos: [['¿Qué son los derechos humanos y por qué importan en la vida diaria?', 'NLAfV4HLYJk']],
    Activity: DetectivesActivity,
    cardClass: 'topicCard topicCard--mint',
  },
  {
    id: 'ciudadania',
    num: '02',
    title: 'Ciudadanía activa',
    idea:
      'La ciudadanía madura distingue entre el diagnóstico verbal permanente y la asunción gradual de responsabilidades compartidas.',
    body: (
      <>
        <p>
          Las democracias contemporáneas conviven con hábitos de crítica rápida —en redes, en la mesa familiar o en la escuela— que
          pocas veces se traducen en propuestas verificables o en vínculos duraderos con instancias de decisión. La ciudadanía
          activa no niega el reclamo legítimo; lo articula con rutas de participación: información contrastada, diálogo con actores
          diversos y acciones escalables que puedan sostenerse en el tiempo sin depender exclusivamente de figuras heroicas.
        </p>
        <p>
          Un aprendizaje central es que el impacto público no está reservado a quienes ostentan cargos formales. Decisiones locales
          sobre espacios comunes, escolarización, seguridad percibida o calidad ambiental se nutren de aportes ordinarios cuando se
          canalizan con método: evidencias, calendarios realistas y acuerdos que distribuyan tareas. Salir de la posición de mero
          espectador —aun con compromisos acotados— altera la dinámica colectiva y reduce la fragmentación entre “los que se quejan”
          y “los que supuestamente arreglan todo”.
        </p>
      </>
    ),
    ejemplo: (
      <>
        Ejemplo en contexto cercano: impulsar una{' '}
        <strong>jornada comunitaria de mantenimiento en un parque o espacio público</strong>, articulando convocatoria abierta,
        gestión de residuos conforme a normativa, permisos cuando aplique y una minuta breve para la autoridad municipal que
        documente necesidades recurrentes —un ciclo que une convivencia, datos y seguimiento institucional.
      </>
    ),
    links: [
      ['Cultura cívica y educación democrática (INE México)', 'https://ine.mx/cultura-civica'],
      [
        '¿Qué es la participación social? (Secretaría de Educación Pública)',
        'https://www.gob.mx/sep/acciones-y-programas/que-es-la-participacion-social',
      ],
      [
        '¿Qué es la participación ciudadana? (ISAF, México)',
        'https://isaf.gob.mx/transparencia/participacion-ciudadana/que-es',
      ],
      ['Participación ciudadana (contexto y modalidades)', 'https://es.wikipedia.org/wiki/Participaci%C3%B3n_ciudadana'],
    ],
    videos: [['Participación ciudadana y espacios democráticos', 'aeOvpnszDNA']],
    Activity: EspectadorCiudadanoActivity,
    cardClass: 'topicCard topicCard--clay',
  },
  {
    id: 'tipos',
    num: '03',
    title: 'Tipos de ciudadanos',
    idea:
      'Tipologías sirven menos para etiquetar personas que para orientar una autocrítica honesta sobre qué aportes buscamos dar.',
    body: (
      <>
        <p>
          En la literatura y en los materiales curriculares suele distinguirse entre quienes cumplen obligaciones formales, quienes
          amplían la participación en redes y proyectos, y quienes inclinan su mirada hacia causas estructurales o marcos normativos
          más amplios. Ningún perfil agota la complejidad humana; todos pueden coexistir tensionados en una misma biografía. Lo
          útil del ejercicio es identificar tendencias dominantes y preguntarse si fortalecen el bien común o si operan como zona
          de confort disfrazada de compromiso.
        </p>
        <p>
          La reflexión incómoda —pero formativa— consiste en contrastar la autoimagen (“soy buen ciudadano”) con evidencias
          conductuales: frecuencia de participación, disposición al diálogo con diferencias legítimas y disposición a asumir costos
          cuando las reglas del juego parecen sesgadas. Reconocer matices permite armar equipos complementarios y evitar tanto el
          maximalismo improductivo como la resignación silenciosa ante lo mejorable.
        </p>
      </>
    ),
    ejemplo: (
      <>
        Contraste orientador: <strong>contribuir recursos de manera puntual</strong> frente a{' '}
        <strong>organizar esfuerzos colectivos que escalen alcance</strong> frente a{' '}
        <strong>incidir en políticas o normas cuando los síntomas locales revelan patrones sistémicos</strong>. La pregunta práctica
        no es cuál rol es “mejor”, sino cuál combinación responde al problema y qué habilidades conviene desarrollar.
      </>
    ),
    links: [
      [
        'La participación de la ciudadanía en la vida pública (SEP · Aprende en Casa)',
        'https://aprendeencasa.sep.gob.mx/secundaria/la-participacion-de-la-ciudadania-en-la-vida-publica/',
      ],
      ['¿Cuáles son los tipos de ciudadanía?', 'https://todosloshechos.es/cuales-son-los-tipos-de-ciudadania'],
    ],
    videos: [['Ciudadanía, derechos y vida en comunidad', 'jCaqbo0B8-A']],
    Activity: TipoCiudadanoActivity,
    cardClass: 'topicCard topicCard--indigo',
  },
  {
    id: 'vivir',
    num: '04',
    title: '¿Qué significa vivir bien?',
    idea:
      'Florecer humanamente exige revisar los indicadores con los que medimos “éxito”: no siempre coinciden con calidad de vida vivida.',
    body: (
      <>
        <p>
          Las sociedades de consumo y meritocracia tienden a equiparar vivir bien con acumular bienes, visibilidad o logros
          comparables. Desde la ética reflexiva —y en diálogo con tradiciones como la virtud aristotélica— conviene ampliar el foco:
          estabilidad emocional relativa, vínculos confiables, autonomía razonable y coherencia entre valores declarados y prácticas.
          Sin ese contrapeso, es posible mantener una trayectoria sociológicamente exitosa al tiempo que se experimenta vacío,
          agotamiento crónico o desajuste entre prioridades y tiempo disponible.
        </p>
        <p>
          Interrogar el propio proyecto de vida resulta incómodo porque puede revelar metas heredadas más que elegidas, o sacrificios
          que ya no se justifican. No obstante, esa tensión es fecunda: permite distinguir entre satisfacciones fugaces y fines que
          organizan la existencia en torno al cuidado, el aprendizaje y la contribución socialmente inteligible. Vivir bien, en este
          sentido maduro, integra propósito personal con responsabilidad hacia quienes rodean nuestras decisiones.
        </p>
      </>
    ),
    ejemplo: (
      <>
        Caso frecuente en entornos competitivos: mantener <strong>reconocimientos externos o cargas de trabajo intensas</strong>{' '}
        sin espacios verificables para <strong>descanso restaurador, duelo legítimo o intimidad relacional</strong> —un patrón donde
        el costo psicosocial puede permanecer invisible hasta agotar capacidades.
      </>
    ),
    links: [
      [
        '¿Qué es la felicidad según Aristóteles? (National Geographic en español)',
        'https://www.nationalgeographicla.com/cultura/2022/10/que-es-la-felicidad-segun-aristoteles',
      ],
      [
        'Eudaimonía en Aristóteles: método para pensar la felicidad (El Debate)',
        'https://www.eldebate.com/cultura/20240804/eudaimonia-aristoteles-metodo-encontrar-felicidad_217551.html',
      ],
      [
        'Aristóteles: ética de la virtud y eudaimonía (La casa de la ética)',
        'https://lacasadelaetica.com/aristoteles-etica-de-la-virtud/',
      ],
    ],
    videos: [
      ['La ética de Aristóteles: felicidad y virtud (Programa Eidos)', 'lsBlk6hKoSE'],
      ['La felicidad en Aristóteles (filosofía antigua)', '4tITFBAKRBE'],
    ],
    Activity: ReflexionVivirBien,
    cardClass: 'topicCard topicCard--sand',
  },
  {
    id: 'equilibrio',
    num: '05',
    title: 'El equilibrio (justo medio)',
    idea:
      'El justo medio es una práctica revisable: regular intensidades, no aspirar a una perfección estática ni caer en la indulgencia sistemática.',
    body: (
      <>
        <p>
          La tradición virtuosa asociada a Aristóteles describe la excelencia moral como un hábito estable orientado a un punto
          intermedio entre defecto y exceso —por ejemplo, entre cobardía y temeridad en el caso del valor. Traducido a dilemmas
          contemporáneos, el esquema ayuda a diagnosticar oscilaciones típicas: hiperexigencia laboral frente al abandono de
          obligaciones; hiperconectividad frente al aislamiento digital paralizante; control rígido frente a impulsividad
          desorganizada.
        </p>
        <p>
          Lo relevante es que el equilibrio no se “obtiene” una sola vez: cambian contextos, cargas emocionales y roles vitales, de
          modo que la regulación ética demanda revisiones periódicas. Aprender a pausar, a delegar, a fijar límites informados o a
          retomar compromisos tras un desvío no es debilidad, sino madurez práctica. La virtud, así entendida, reconoce la finitud
          humana sin renunciar a la mejora continua.
        </p>
      </>
    ),
    ejemplo: (
      <>
        Caso habitual: sustituir la navegación reactiva en <strong>redes sociales</strong> por sesiones delimitadas con{' '}
        <strong>objetivos formativos o comunitarios explícitos</strong>, combinadas con acuerdos personales de hiato —un ejemplo
        modesto de cómo el medio virtuoso se opera mediante reglas claras y autocontrol situacional.
      </>
    ),
    links: [
      [
        'La virtud está en el medio, ¿y qué más? (blog de Abel Marín)',
        'https://www.abelmarin.com/la-virtud-esta-en-el-medio-y-que-mas/',
      ],
      ['Justo medio (enciclopedia en español · Herder)', 'https://encyclopaedia.herdereditorial.com/wiki/Justo_medio'],
    ],
    videos: [
      ['Aristóteles y la ética: eudemonismo y término medio', 'Q1-8JUkE1yM'],
      ['Ética y virtud en el justo medio', 'bFQu6dD5lSc'],
    ],
    Activity: BalanzaActivity,
    cardClass: 'topicCard topicCard--sage',
  },
]

export default function App() {
  useReveal()

  const navLinks = [
    ['Portada', 'hero'],
    ['Subtemas', 'subtemas'],
    ['Conclusiones', 'conclusiones'],
    ['Reflexión personal', 'reflexion'],
    ['Recursos', 'recursos'],
  ]

  const footerYear = useMemo(() => new Date().getFullYear(), [])

  return (
    <div className="shell">
      <header className="topNav">
        <div className="topNav_inner">
          <a className="brand" href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            Ética profesional y ciudadanía <span aria-hidden>|</span> Evidencia Final
          </a>
          <nav className="navLinks" aria-label="Secciones del blog">
            {navLinks.map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(id)
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="flow">
        <section id="hero" className="hero js-reveal">
          <div className="hero_grid">
            <div className="hero_copy">
              <p className="eyebrow">Blog reflexivo • Esteban Rojas</p>
              <h1 className="hero_title">
                Ética profesional y ciudadanía: aprendizajes del Módulo&nbsp;3
              </h1>
              <p className="hero_sub">
                
              </p>
              <p className="hero_intro">
                Una mirada que parte del contraste entre lo que decimos creer y lo que efectivamente ocurre en escuelas,
                espacios públicos y relaciones cotidianas: derechos, participación, propósito personal y regulación ética del día a día.
              </p>
              <button type="button" className="primary" onClick={() => scrollToSection('subtemas')}>
                Explorar contenidos
              </button>
            </div>

            <div className="hero_panel" aria-hidden>
              <div className="orb orb_one" />
              <div className="orb orb_two" />
              <div className="hero_meta">
                <span className="metaLine metaLine_top">Cinco rutas prácticas</span>
                <span className="metaLine metaLine_mid">Ejemplos vivos</span>
                <span className="metaLine metaLine_bottom">Interactividades por tarjeta</span>
              </div>
            </div>
          </div>
          <span className="scrollCue" aria-hidden />
        </section>

        <section id="subtemas" className="topicsSection js-reveal">

          <div className="topicStack">
            {SUBTEMAS.map((topic) => {
              const Activity = topic.Activity
              const panelId = `panel-${topic.id}`
              const hdrId = `hdr-${topic.id}`

              return (
                <details key={topic.id} id={topic.id} className={`${topic.cardClass} topicDisclosure`}>
                  <summary className="topicHdr" id={hdrId}>
                    <span className="topicNum">{topic.num}</span>
                    <span className="topicTitleWrap">
                      <span className="topic_title">{topic.title}</span>
                      <span className="topic_pull">{ideaShort(topic.idea)}…</span>
                    </span>
                    <span className="topicChevron" aria-hidden>
                      ›
                    </span>
                  </summary>

                  <div
                    id={panelId}
                    className="topicBodyInner"
                    role="region"
                    aria-labelledby={hdrId}
                  >
                      <blockquote className="pullQuote">{topic.idea}</blockquote>

                      <div className="prose">{topic.body}</div>
                      <p className="prose destacado ejemplo">{topic.ejemplo}</p>

                      <div className="grid2">
                        <div>
                          <h3 className="inlineH">Recursos de lectura</h3>
                          <ul className="linkStack">
                            {topic.links.map(([label, url]) => (
                              <li key={url}>
                                <ResourceLink href={url}>{label}</ResourceLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="inlineH">Video</h3>
                          <div className="videoCols">
                            {topic.videos.map(([label, vid]) => (
                              <div key={vid}>
                                <p className="vidLabel">{label}</p>
                                <YouTubeEmbed id={vid} title={label} />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <details className="activityDetails">
                        <summary>Abrir actividad interactiva</summary>
                        <Activity />
                      </details>
                  </div>
                </details>
              )
            })}
          </div>
        </section>

        <section id="conclusiones" className="narrow js-reveal">
          <div className="sectionHead">
            <h2>Conclusiones integradoras</h2>
          </div>
          <div className="cardSoft">
            <p>
              En conjunto, estos ejes sugieren que la ética aplicada combina tres movimientos: prestar atención fina a cómo se trata
              a las personas en contextos reales; traducir juicios en compromisos públicos o comunitarios que no dependan solo de la
              queja; y volver la mirada hacia uno mismo para evaluar si las prácticas cotidianas —incluidas las laborales y las
              digitales— sostienen o erosionan dignidad propia y ajena.
            </p>
            <p>
              La reflexión sobre vivir bien y el justo medio cierra el circuito: remindernos que fines materiales o reputacionales,
              si no se ordenan dentro de un proyecto equilibrado, pueden desplazar relaciones, salud y sentido. Integrar derechos,
              ciudadanía y virtudes personales fortalece pensamiento crítico y empatía, pero sobre todo habitúa decisiones más
              coherentes con valores declarados en democracia.
            </p>
          </div>
        </section>

        <section id="reflexion" className="narrow js-reveal">
          <div className="sectionHead">
            <h2>Reflexión personal — Esteban Rojas</h2>
          </div>
          <div className="cardAccent">
            <p>
              Lo que más me llevo del módulo es la insistencia en cerrar la brecha entre principios admirables y prácticas
              observables. Los derechos humanos dejan de sonar abstractos cuando uno empieza a notar exclusiones cotidianas y se
              pregunta qué puede hacer, incluso de forma modesta, sin convertir la indignación en espectáculo ni la pasividad en
              cinismo.
            </p>
            <p>
              La ciudadanía activa me interpela a sustituir lamentos prolongados por pasos concretos —información verificada,
              diálogo con otros actores, propuestas escalables— porque el cambio suele anidar en gestiones pequeñas pero sostenidas.
              El apartado sobre tipos de ciudadanos me recuerda revisar con honestidad si mi compromiso aporta o solo cumple una
              imagen cómoda de “buen ciudadano”.
            </p>
            <p>
              Por último, reflexionar sobre vivir bien y sobre el justo medio me obliga a confrontar narrativas de éxito que casi
              nunca miden descanso, vínculos ni propósito. Aspiro a que mi trayectoria combine rigor profesional con límites sanos y
              contribución real al entorno, entendiendo que el equilibrio se negocia día a día y que la ética personal alimenta —o
              debilita— la vida en comunidad.
            </p>
          </div>
        </section>

        <section id="recursos" className="narrow js-reveal">
          <div className="sectionHead">
            <h2>Fuentes y recursos citados</h2>
            <p className="sourcesLead">
              Enlaces externos agrupados por subtema; lecturas y videos en un solo bloque.
            </p>
          </div>
          <div className="sourcesCompact cardSoft">
            <dl className="sourcesDl">
              {SUBTEMAS.map((topic) => {
                const entries = [
                  ...topic.links.map(([label, url]) => ({ label, url, kind: 'read' })),
                  ...topic.videos.map(([label, vid]) => ({
                    label,
                    url: `https://www.youtube.com/watch?v=${vid}`,
                    kind: 'video',
                  })),
                ]
                return (
                  <div key={topic.id} className="sourcesDl_group">
                    <dt className="sourcesDt">{topic.title}</dt>
                    <dd className="sourcesDd">
                      <ul className="sourcesUl">
                        {entries.map((item) => (
                          <li key={`${topic.id}-${item.url}`}>
                            {item.kind === 'video' && (
                              <span className="sourcesKind" aria-hidden>
                                ▶
                              </span>
                            )}
                            <ResourceLink href={item.url}>{item.label}</ResourceLink>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        </section>
      </main>

      <footer className="siteFooter js-reveal">
        <div className="footerInner">
          <p>
            <strong>Blog académico Ética y Ciudadanía</strong>. Contenidos educativos y enlaces externos de referencia.
          </p>
          <p className="footerMeta">
            By: Esteban Rojas • Módulo 3 • Evidencia Final • {footerYear}
          </p>
        </div>
      </footer>
    </div>
  )
}

function ideaShort(idea) {
  const cut = idea.slice(0, 72)
  return cut.length >= idea.length ? idea : `${cut}`
}

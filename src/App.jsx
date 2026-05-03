import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
                Orientación para este caso (no es única lectura legal):{' '}
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
        Tu reflexión privada (no se guarda en el servidor)
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
    idea: 'Los derechos humanos solo tienen sentido cuando se viven y se respetan en la vida cotidiana.',
    body: (
      <>
        Los derechos humanos protegen la dignidad de las personas, pero muchas veces solo existen en documentos y
        no en la práctica. Este subtema invita a reflexionar sobre las desigualdades reales y la importancia de
        reconocer cuándo se vulneran los derechos.
      </>
    ),
    ejemplo: (
      <>
        Ejemplo práctico: <strong>discriminación en la escuela</strong> o falta sistemática de acceso a{' '}
        <strong>educación de calidad</strong> para algunos grupos.
      </>
    ),
    links: [
      ['Declaración Universal de los Derechos Humanos', 'https://www.ohchr.org/es/human-rights/universal-declaration/translations/spanish'],
      ['Educación como derecho (Humanium)', 'https://www.humanium.org/es/derecho-educacion/'],
    ],
    videos: [['Video complementario DD.HH.', 'cQyEZ5erG6k']],
    Activity: DetectivesActivity,
    cardClass: 'topicCard topicCard--mint',
  },
  {
    id: 'ciudadania',
    num: '02',
    title: 'Ciudadanía activa',
    idea:
      'Un ciudadano activo no solo critica lo que está mal, también participa para transformarlo.',
    body: (
      <>
        La ciudadanía implica participación, organización y responsabilidad social. No basta con observar los
        problemas, es necesario actuar dentro de redes confiables, con información verificada y respetando la
        diversidad de opiniones legítimas.
      </>
    ),
    ejemplo: (
      <>
        Ejemplo en contexto cercano: <strong>organizar una jornada de limpieza de un parque comunitario</strong>, con
        permisos, materiales segregados y registro ante la instancia municipal correspondiente.
      </>
    ),
    links: [
      ['Ciudadanía activa (INE)', 'https://portalanterior.ine.mx/archivos2/s/DECEYEC/EducacionCivica/Ciudadania-Activa.pdf'],
      ['Participación social (gob.mx/SEP)', 'https://www.gob.mx/sep/acciones-y-programas/que-es-la-participacion-social'],
    ],
    videos: [['Participación ciudadana', 'aeOvpnszDNA']],
    Activity: EspectadorCiudadanoActivity,
    cardClass: 'topicCard topicCard--clay',
  },
  {
    id: 'tipos',
    num: '03',
    title: 'Tipos de ciudadanos',
    idea: 'No todos participan igual, pero todos pueden evolucionar.',
    body: (
      <>
        Reconocer perfiles permite diseñar mejores alianzas: el <strong>ciudadano responsable</strong>, el{' '}
        <strong>participativo</strong> y el orientado <strong>hacia la justicia</strong> responden a distintos
        estilos de compromiso cuando conviven valores democráticos.
      </>
    ),
    ejemplo: (
      <>
        Contraste rápido: <strong>donar</strong> recursos puntualmente, <strong>organizar</strong> colectividades
        para ampliar el impacto o <strong>transformar reglas institucionales</strong> cuando se detectan desigualdades
        estructurales.
      </>
    ),
    links: [
      ['Articulación académica Dialnet', 'https://dialnet.unirioja.es/servlet/articulo?codigo=4683210'],
    ],
    videos: [
      ['Enfoque 1', 'jCaqbo0B8-A'],
      ['Enfoque 2', 'TZIXQYc-524'],
    ],
    Activity: TipoCiudadanoActivity,
    cardClass: 'topicCard topicCard--indigo',
  },
  {
    id: 'vivir',
    num: '04',
    title: '¿Qué significa vivir bien?',
    idea: 'Vivir bien no es tener más, es vivir con sentido.',
    body: (
      <>
        La felicidad no es solo material, sino un entramado de equilibrios emocionales, relaciones significativas y
        sentido práctico. Pensar así evita que el éxito aparente encubra ausencias profundas de bienestar.
      </>
    ),
    ejemplo: (
      <>
        Un caso habitual: obtener <strong>reconocimientos públicos continuos sin espacio genuino para el descanso o el
        duelo.</strong>
      </>
    ),
    links: [
      ['Felicidad según Aristóteles (National Geographic)', 'https://www.nationalgeographicla.com/cultura/2022/10/que-es-la-felicidad-segun-aristoteles'],
      ['Artículo SciELO', 'https://ve.scielo.org/scielo.php?pid=S1010-29142015000200002&script=sci_arttext'],
    ],
    videos: [
      ['Reflexiones sobre vida plena', 'Xv0qAQV6ZUk'],
      ['Bienestar desde distintos ángulos', '8bgCp4dbh7o'],
    ],
    Activity: ReflexionVivirBien,
    cardClass: 'topicCard topicCard--sand',
  },
  {
    id: 'equilibrio',
    num: '05',
    title: 'El equilibrio (justo medio)',
    idea: 'El equilibrio no es evitar todo, es saber regularlo.',
    body: (
      <>
        Aristóteles enseña la virtud como el punto medio razonable entre extremos nocivos de exceso y defecto,
        aplicable hoy mismo al autocuidado, al consumo informativo y a la vida cotidiana digital.
      </>
    ),
    ejemplo: (
      <>
        Caso habitual: usar <strong>redes sociales con propósitos formativos definidos</strong> y tiempos límite, en
        lugar de navegación reactiva interminable.
      </>
    ),
    links: [
      ['Concepto Herder Editorial', 'https://encyclopaedia.herdereditorial.com/wiki/Justo_medio'],
    ],
    videos: [['Ética y virtud mediada', 'bFQu6dD5lSc']],
    Activity: BalanzaActivity,
    cardClass: 'topicCard topicCard--sage',
  },
]

export default function App() {
  useReveal()

  const [open, setOpen] = useState(() => ({
    dh: false,
    ciudadania: false,
    tipos: false,
    vivir: false,
    equilibrio: false,
  }))

  const toggle = useCallback((id) => {
    setOpen((o) => ({ ...o, [id]: !o[id] }))
  }, [])

  const navLinks = [
    ['Portada', 'hero'],
    ['Subtemas', 'subtemas'],
    ['Conclusiones', 'conclusiones'],
    ['Reflexión personal', 'reflexion'],
    ['Recursos', 'recursos'],
  ]

  const yearRef = useRef(new Date().getFullYear())

  return (
    <div className="shell">
      <header className="topNav">
        <div className="topNav_inner">
          <a className="brand" href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>
            Módulo 3 <span aria-hidden>|</span> Ética &amp; ciudadanía
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
              <p className="eyebrow">Blog reflexivo • Español</p>
              <h1 className="hero_title">
                Ética, ciudadanía y vida en comunidad: aprendizajes esenciales del Módulo&nbsp;3
              </h1>
              <p className="hero_sub">
                Una mirada reflexiva sobre los derechos humanos, la participación ciudadana, la felicidad y el equilibrio
                personal.
              </p>
              <p className="hero_intro">
                Este blog integra cinco subtemas esenciales del Módulo 3 que permiten comprender cómo la ética y la ciudadanía
                impactan en nuestra vida diaria. No se trata solo de aprender conceptos, sino de reflexionar sobre nuestra forma
                de vivir, convivir y tomar decisiones.
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
          <div className="sectionHead">
            <h2>Ejes del módulo</h2>
            <p>
              Cada bloque puede expandirse. Incluye recursos externos (se abren en pestaña nueva) y una actividad para detener el
              ritmo lectura–reflexión.
            </p>
          </div>

          <div className="topicStack">
            {SUBTEMAS.map((topic) => {
              const Activity = topic.Activity
              const isOpen = open[topic.id]
              const panelId = `panel-${topic.id}`
              const hdrId = `hdr-${topic.id}`

              return (
                <article key={topic.id} className={topic.cardClass}>
                  <button
                    type="button"
                    id={hdrId}
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    className="topicHdr"
                    onClick={() => toggle(topic.id)}
                  >
                    <span className="topicNum">{topic.num}</span>
                    <span className="topicTitleWrap">
                      <span className="topic_title">{topic.title}</span>
                      <span className="topic_pull">{ideaShort(topic.idea)}…</span>
                    </span>
                    <span className={`topicChevron ${isOpen ? 'topicChevron--open' : ''}`} aria-hidden>
                      ›
                    </span>
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={hdrId}
                    className={`topicBodyWrap ${isOpen ? 'topicBodyWrap--open' : ''}`}
                  >
                    <div className="topicBodyInner">
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
                  </div>
                </article>
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
              Los temas abordados permiten comprender que la ética no es algo teórico, sino una guía para la vida diaria.
              Los derechos humanos, la ciudadanía activa, la reflexión sobre la felicidad y el equilibrio personal forman una
              base para tomar mejores decisiones y convivir de manera más justa. Este aprendizaje ayuda a desarrollar pensamiento
              crítico, empatía y responsabilidad social.
            </p>
          </div>
        </section>

        <section id="reflexion" className="narrow js-reveal">
          <div className="sectionHead">
            <h2>Reflexión personal del autor/a</h2>
          </div>
          <div className="cardAccent">
            <p>
              El estudio de estos temas impacta directamente en mi forma de ver el mundo. Me hace más consciente de mis
              decisiones, de mi papel como ciudadano y de la importancia de actuar con responsabilidad tanto en mi vida
              personal como profesional. En el ámbito laboral, me permitirá actuar con ética, respetar a los demás y tomar
              decisiones más justas. En lo personal, me ayuda a buscar equilibrio, propósito y una vida más consciente.
              Comprendo que no solo se trata de crecer individualmente, sino de contribuir al bienestar de los demás.
            </p>
          </div>
        </section>

        <section id="recursos" className="wide js-reveal">
          <div className="sectionHead">
            <h2>Fuentes y recursos citados</h2>
            <p>Lista compilada desde los bloques previos para una revisión rápida.</p>
          </div>
          <div className="sourcesGrid">
            {SUBTEMAS.map((topic) => (
              <article key={`src-${topic.id}`} className="sourceMini">
                <h3>{topic.title}</h3>
                <ul>
                  {[...topic.links, ...topic.videos.map(([l, vid]) => [`Video: ${l}`, `https://www.youtube.com/watch?v=${vid}`])].map(
                    ([label, url]) => (
                      <li key={`${topic.id}-${url}`}>
                        <ResourceLink href={url}>{label}</ResourceLink>
                      </li>
                    )
                  )}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="siteFooter js-reveal">
        <div className="footerInner">
          <p>
            <strong>Blog académico Ética y Ciudadanía</strong>. Contenidos educativos y enlaces externos de referencia. El material
            embebido proviene de terceros; respeta cada licencia cuando reutilices material.
          </p>
          <p className="footerMeta">
            Módulo 3 • Proyecto académico • {yearRef.current}
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

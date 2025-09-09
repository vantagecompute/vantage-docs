import React from 'react'
import styles from './styles.module.css'
import { useHistory } from '@docusaurus/router'

import HomeDocsFeat from '../../../static/img/home-docs-feat.png'
import HomeFAQFeat from '../../../static/img/home-faq-feat.png'

const FeatureList = [
  {
    title: 'Overview',
    linkTo: '/docs/overview/welcome',
    img: HomeDocsFeat,
    description: <>Dig into the Vantage Docs.</>,
  },
  {
    title: 'FAQ',
    linkTo: '/docs/overview/faq',
    img: HomeFAQFeat,
    description: <>Find answers to the most frequently asked questions.</>,
  },
]

function Feature({ img, title, linkTo, description }) {
  const history = useHistory()
  return (
    <div className={styles.featureBox}>
      <div className={styles.featureLink} onClick={() => history.push(linkTo)}>
        <div className='text--center'>
          <img className={styles.featureImg} src={img} />
        </div>
        <div className='text--center'>
          <h3 className={styles.featureTitle}>{title}</h3>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className={styles.featuresRow}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </div>
    </section>
  )
}

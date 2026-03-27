"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase"

export default function Home() {
  const [data, setData] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])

  const [selectedCity, setSelectedCity] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [liked, setLiked] = useState("")

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("dinewise").select("*")
      setData(data || [])
      setFiltered(data || [])
    }
    fetchData()
  }, [])

  // extract cuisines properly
  const cuisines = [
    ...new Set(
      data.flatMap((r: any) =>
        (r.cuisines || "")
          .split(",")
          .map((c: string) => c.trim())
      )
    ),
  ]

  // extract cities
  const cities = [
    ...new Set(
      data.map((r: any) =>
        r.location?.split(",").pop().trim()
      )
    ),
  ]

  // similarity function (your old logic 🔥)
  const getScore = (base: any, other: any) => {
    if (base.restaurant_name === other.restaurant_name) return -Infinity

    let score = 0

    const baseCuisine = (base.cuisines || "").split(",")
    const otherCuisine = (other.cuisines || "").split(",")

    const common = baseCuisine.filter((c: string) =>
      otherCuisine.includes(c)
    ).length

    score += common * 0.5

    if (base.location === other.location) score += 0.3

    score += (other.rating - 3.5) * 0.2

    return score
  }

  // main recommend function
  const handleRecommend = () => {
    let list = [...data]

    const base =
      data.find((r) => r.restaurant_name === liked) || data[0]

    list = list
      .map((r) => ({
        ...r,
        _score: getScore(base, r),
      }))
      .sort((a, b) => b._score - a._score)

    // filters
    if (selectedCity) {
      list = list.filter((r) =>
        r.location.includes(selectedCity)
      )
    }

    if (selectedCuisine) {
      list = list.filter((r) =>
        (r.cuisines || "")
          .split(",")
          .map((c: string) => c.trim())
          .includes(selectedCuisine)
      )
    }

    list = list.filter((r) => r.rating >= minRating)

    setFiltered(list.slice(0, 9))
  }

  // similar button
  const handleSimilar = (name: string) => {
    setLiked(name)
    setTimeout(() => handleRecommend(), 100)
  }

  return (
    <div className="container">

      {/* Header */}
      <div className="header">
        <div className="title">
          <div className="logo">🍽️</div>
          <div>
            <h1>DineWise🍽️</h1>
            <div className="subtitle">
              Smart suggestions using Cuisine • Location • Rating
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="panel">
        <div className="filters">

          {/* liked */}
          <div className="field wide">
            <label className="label">Pick a restaurant</label>
            <select onChange={(e) => setLiked(e.target.value)}>
              {data.map((r) => (
                <option key={r.id}>{r.restaurant_name}</option>
              ))}
            </select>
          </div>

          {/* city */}
          <div className="field">
            <label className="label">City</label>
            <select onChange={(e) => setSelectedCity(e.target.value)}>
              <option value="">Any</option>
              {cities.map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </select>
          </div>

          {/* cuisine */}
          <div className="field">
            <label className="label">Cuisine</label>
            <select onChange={(e) => setSelectedCuisine(e.target.value)}>
              <option value="">Any</option>
              {cuisines.map((c, i) => (
                <option key={i}>{c}</option>
              ))}
            </select>
          </div>

          {/* rating */}
          <div className="field">
            <label className="label">Min Rating</label>
            <select onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value="0">Any</option>
              <option value="3.5">3.5</option>
              <option value="4.0">4.0</option>
              <option value="4.5">4.5</option>
            </select>
          </div>

          {/* button */}
          <div className="field">
            <button className="btn" onClick={handleRecommend}>
              Recommend
            </button>
          </div>

        </div>
      </div>

      {/* Results */}
      <div className="grid">
        {filtered.map((r: any) => (
          <div key={r.id} className="card">

            <div className="rating">⭐ {r.rating}</div>

            <h3>{r.restaurant_name}</h3>

            <div className="cuisines">
              {(r.cuisines || "").split(",").join(" • ")}
            </div>

            <div className="chips">
              <span className="badge">📍 {r.location}</span>
              <span className="badge">💸 ₹{r.average_price}</span>
              <span className="badge">⏱ {r.average_delivery_time} mins</span>
            </div>

            <div className="actions">
              <button
                className="btn secondary"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${r.restaurant_name} ${r.location}`
                  )
                }
              >
                View
              </button>

              <button
                className="btn"
                onClick={() => handleSimilar(r.restaurant_name)}
              >
                Similar
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="footerNote" style={{ textAlign: "center", marginTop: "20px" }}>
        Made with ❤️ by Krishna
      </div>

    </div>
  )
}
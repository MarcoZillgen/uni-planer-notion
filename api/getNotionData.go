package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/jomei/notionapi"
)

var DB_ID = os.Getenv("DB_ID")
var NOTION_KEY = os.Getenv("NOTION_KEY")

func getNotionData(w http.ResponseWriter, r *http.Request) {
	client := notionapi.NewClient(notionapi.Token(NOTION_KEY))
	db, err := client.Database.Query(context.Background(), notionapi.DatabaseID(DB_ID), nil)
	if err != nil {
		panic(err)
	}
	data := db.Results

	var eventDatas []EventData

	for _, page := range data {
		// check all attributes
		attributeErr := false
		for _, attribute := range []string{"Name", "Start", "End", "Day", "Color", "Type"} {
			if _, ok := page.Properties[attribute]; !ok {
				attributeErr = true
				return
			}
		}
		if attributeErr {
			continue
		}

		event := EventData{
			Title:     page.Properties["Name"].(*notionapi.TitleProperty).Title[0].PlainText,
			StartTime: page.Properties["Start"].(*notionapi.NumberProperty).Number,
			EndTime:   page.Properties["End"].(*notionapi.NumberProperty).Number,
			Day:       page.Properties["Day"].(*notionapi.SelectProperty).Select.Name,
			Color:     page.Properties["Color"].(*notionapi.SelectProperty).Select.Name,
			EventType: page.Properties["Type"].(*notionapi.SelectProperty).Select.Name,
		}

		eventDatas = append(eventDatas, event)
	}

	fmt.Println(eventDatas)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(eventDatas)
}

type EventData struct {
	Title     string
	StartTime float64
	EndTime   float64
	Color     string
	EventType string
	Day       string // monday, tuesday, etc.
}

# src/idi_pb.js: data/idi.proto
# 	protoc --proto_path=./data --js_out=import_style=commonjs,binary:src $<

public/data.pb: data/*
	cd data && Rscript import_data.R

public/idi.proto: data/idi.proto
	cp $< $@

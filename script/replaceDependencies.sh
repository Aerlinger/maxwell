#!/usr/bin/env sh
sudo -v

files=0;
for file in $(find ../test/ -name *.coffee)
do
  fname=$(basename $file)

  awk '
  BEGIN {
    print "# <DEFINE>"

    print "define ["
  }
  /= *require/ { 
    modules[$1] = NR;
  }
  END {
    for (name in modules) {
      print "  \x27" "cs!" name "\x27" ","
    }

    print "], ("

    for (name in modules) {
      print "  \x27" name "\x27" ","
    }

    print ") ->"

    print "# </DEFINE>"
  }
  ' $file > ./tmp/$fname

  cat ./tmp/$fname

  cat $file >> ./tmp/$fname

  #sed -E -i'/= *require\(/g' ./tmp/$fname

  cp -f ./tmp/$fname $file

  echo output written to ./tmp/$fname
done

